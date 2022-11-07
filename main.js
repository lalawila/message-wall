class Post {
    constructor({ postId, content, publishTime }) {
        this.postId = postId
        this.content = content
        this.publishTime = publishTime
    }

    renderElement() {
        const postElement = document.createElement("div")
        postElement.classList.add("post")

        const contentElement = document.createElement("p")
        contentElement.classList.add("content")
        contentElement.textContent = this.content

        postElement.append(contentElement)

        const bottom = document.createElement("div")
        bottom.classList.add("bottom")
        postElement.append(bottom)

        const time = document.createElement("p")
        time.classList.add("time")
        time.textContent = this.formatTime(this.publishTime)

        bottom.append(time)

        const buttons = document.createElement("div")
        buttons.classList.add("buttons")
        bottom.append(buttons)

        const editElement = document.createElement("div")
        editElement.classList.add("button")
        editElement.classList.add("edit")

        // 创建输入框
        const inputElement = document.createElement("textarea")
        inputElement.classList.add("input-content")
        inputElement.value = this.content

        // 创建确认按钮
        const confirmElement = document.createElement("div")
        confirmElement.classList.add("button")
        confirmElement.classList.add("confirm")
        confirmElement.textContent = "确认"

        // 创建取消按钮
        const cancelElement = document.createElement("div")
        cancelElement.classList.add("button")
        cancelElement.classList.add("cancel")
        cancelElement.textContent = "取消"

        editElement.onclick = () => {
            // 点击编辑
            contentElement.replaceWith(inputElement)
            // 编辑按钮替换成确认按钮
            editElement.replaceWith(confirmElement)
            // 6. 删除按钮替换成取消按钮
            deleteElement.replaceWith(cancelElement)
        }

        confirmElement.onclick = async () => {
            // 1. 更新消息
            await api.updatePost(this.postId, inputElement.value)
            myAlert.alertSuccess("消息更新成功")

            // 2. 输入框替换回原来的文本元素
            contentElement.textContent = inputElement.value

            inputElement.replaceWith(contentElement)
            confirmElement.replaceWith(editElement)
            cancelElement.replaceWith(deleteElement)
        }

        cancelElement.onclick = function () {
            inputElement.replaceWith(contentElement)
            confirmElement.replaceWith(editElement)
            cancelElement.replaceWith(deleteElement)
        }

        editElement.textContent = "编辑"
        buttons.append(editElement)

        const deleteElement = document.createElement("div")
        deleteElement.classList.add("button")
        deleteElement.classList.add("delete")
        deleteElement.textContent = "删除"

        deleteElement.onclick = async () => {
            if (confirm("确定要删除吗？")) {
                // 1. 调用删除接口
                await api.deletePost(this.postId)
                myAlert.alertSuccess("删除成功")

                // 2. 删掉消息元素自身
                postElement.remove()
            }
        }

        buttons.append(deleteElement)

        return postElement
    }

    formatTime(timestamp) {
        // 时间戳转成时间
        const time = new Date(timestamp * 1000)
        return `${time.getFullYear()}-${this.fillZero(
            time.getMonth() + 1
        )}-${time.getDate()} ${this.fillZero(time.getHours())}:${this.fillZero(
            time.getMinutes()
        )}`
    }

    fillZero(n) {
        return n < 10 ? `0${n}` : n
    }
}

class Manager {
    limit = 5
    page = 1

    // 是否加载中
    isLoading = false
    // 是否获取完成
    isFinished = false

    // 搜索的文本
    search = ""

    constructor() {
        window.addEventListener("load", () => {
            // 显示发布框
            document.querySelector("#container .publish").onclick = () =>
                this.publishClick()

            // 三种方法：
            // 1. 将 publishClick 修改为箭头函数
            // publishClick = () => {}
            // 2. bind 绑定 this
            // this.publishClick.bind(this)
            // 3. 放到箭头函数中
            // () => this.publishClick()

            // 取消按钮，隐藏发布框
            document.querySelector("#container .cancel").onclick = () =>
                this.cancelClick()

            // 发布按钮，发布消息
            document.querySelector("#container .confirm").onclick = () =>
                this.confirmClick()

            document.querySelector("#container .search").onclick = () =>
                this.searchClick()

            document.querySelector("#container .clear").onclick = () =>
                this.clearClick()

            window.addEventListener("scroll", () => {
                // 滚动距离页面底部的距离
                // HTML 元素内容的整体高度 - （HTML 元素顶部滚动出的高度 + ）
                // 参考 https://3yya.com/courseware/chapter/211
                const bottomOfWindowHeight =
                    document.documentElement.offsetHeight -
                    (document.documentElement.scrollTop +
                        document.documentElement.clientHeight)

                if (bottomOfWindowHeight < 100) {
                    // 页面距离底部小于 100 像素
                    // 加载数据
                    this.getPosts()
                }
            })

            // 读取帖子
            this.getPosts()
        })
    }

    searchClick() {
        this.search = document.querySelector("#container .search-input").value
        this.getPosts(true)
    }

    clearClick() {
        this.search = ""
        this.getPosts(true)
    }

    publishClick() {
        document.querySelector("#container .input-dialog").hidden = false

        // 平滑滚到页头
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    cancelClick() {
        document.querySelector("#container .input-dialog").hidden = true
    }

    async confirmClick() {
        const content = document.querySelector(
            "#container .input-content"
        ).value

        if (content.length < 5) {
            myAlert.alertWarning("至少 5 个字符。")
            return
        }

        if (content.length > 100) {
            myAlert.alertWarning("最多 100 个字符。")
            return
        }

        await api.publishPost(content)

        myAlert.alertSuccess("发布成功")

        document.querySelector("#container .input-content").value = ""
        document.querySelector("#container .input-dialog").hidden = true

        this.getPosts(true)
    }

    async getPosts(refresh = false) {
        if (refresh) {
            // 刷新页面
            this.isFinished = false
            this.page = 1

            document.querySelector("#container .empty").hidden = true
            document.querySelector("#container .posts").innerHTML = ""
        }

        if (this.isLoading || this.isFinished) {
            // 如果在加载中，或没有数据了，则直接退出
            return
        }

        this.isLoading = true
        const { results } = await api.getPosts({
            page: this.page,
            limit: this.limit,
            search: this.search,
        })
        this.isLoading = false

        if (results.length === 0) {
            // 已经没有更多了
            this.isFinished = true
            document.querySelector("#container .empty").hidden = false
            return
        }

        const postsElement = document.querySelector("#container .posts")
        results.forEach((data) => {
            const post = new Post({
                postId: data.post_id,
                content: data.content,
                publishTime: data.publish_time,
            })

            postsElement.append(post.renderElement())
        })

        this.page++

        if (!this.isScroll()) {
            // 如果没出现滚动条
            // 则继续拿数据
            return this.getPosts()
        }
    }

    isScroll() {
        // 是否出现了滚动条
        return (
            document.documentElement.clientHeight !=
            document.documentElement.scrollHeight
        )
    }
}

// api 实例
const api = new Api("https://3yya.com/u/d8cf630cf5f367cc/rest/app")
// const api = new Api(
//     "http://127.0.0.1:9000/u/d8cf630cf5f367cc/rest/app"
// )

// alert 实例
const myAlert = new Alert(3500)

new Manager()
