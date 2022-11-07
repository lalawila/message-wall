class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async getPosts() {
        // GET
        // 获取帖子列表

        // 把浏览器 url 的查询字符串的 search 值
        // 给到接口请求的 url 当中

        // 接口的 url
        const url = new URL(`${this.baseUrl}/posts`)

        const search = new URL(window.location.href).searchParams.get("search")
        if (search) {
            url.searchParams.set("search", search)
        }

        const response = await fetch(url)
        return response.json()
    }

    async createPost(content) {
        // POST
        // 发布帖子

        let data = {
            content: content,
        }

        const response = await fetch(`${this.baseUrl}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // 表明内容是 JSON 格式
            },
            body: JSON.stringify(data), // 序列化对象
        })
        return response.json()
    }

    async updatePost(postId, content) {
        // PUT
        // 更新帖子
        let data = {
            content: content,
        }

        const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", // 表明内容是 JSON 格式
            },
            body: JSON.stringify(data), // 序列化对象
        })

        return response.json()
    }

    async deletePost(postId) {
        // DELETE
        // 删除帖子

        const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
            method: "DELETE",
        })

        return response.json()
    }
}
