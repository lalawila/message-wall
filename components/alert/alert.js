class Alert {
    constructor(duration = 5000) {
        console.assert(duration >= 1500, "至少 1500 毫秒")

        this.duration = duration
        window.addEventListener("load", function () {
            if (!document.querySelector(".message-container")) {
                // 消息的容器

                const container = document.createElement("div")
                container.classList.add("message-container")

                document.body.append(container)
            }
        })
    }

    showMsg({ msg = "", type = "info", duration = this.duration } = {}) {
        // type:
        // - info
        // - success
        // - warning
        // - error

        const container = document.querySelector(".message-container")

        const text = document.createElement("div")
        text.innerText = msg
        text.classList.add("text")
        text.classList.add(type)

        container.append(text)

        // 显示动画
        setTimeout(() => text.classList.add("animation"), 10)
        // 隐去动画
        setTimeout(() => text.classList.remove("animation"), duration - 1000)
        // 删除元素
        setTimeout(() => text.remove(), duration)
    }

    // 二次封装函数
    alertInfo = (msg) => this.showMsg({ msg, type: "info" })
    alertSuccess = (msg) => this.showMsg({ msg, type: "success" })
    alertWarning = (msg) => this.showMsg({ msg, type: "warning" })
    alertError = (msg) => this.showMsg({ msg, type: "error" })
}
