class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }

    async getPosts({ page = 1, limit = 10, search = "" } = {}) {
        const url = new URL(`${this.baseUrl}/posts`)
        url.searchParams.append("page", page)
        url.searchParams.append("limit", limit)
        url.searchParams.append("search", search)

        const response = await fetch(url)

        return response.json()
    }

    async publishPost(content) {
        const response = await fetch(`${this.baseUrl}/posts`, {
            method: "post",
            headers: {
                "Content-Type": "application/json", // 表明内容是 JSON 格式
            },
            body: JSON.stringify({
                content,
            }), // 序列化对象
        })

        return response.json()
    }

    async updatePost(postId, content) {
        const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
            method: "put",
            headers: {
                "Content-Type": "application/json", // 表明内容是 JSON 格式
            },
            body: JSON.stringify({
                content,
            }), // 序列化对象
        })

        return response.json()
    }

    async deletePost(postId) {
        const response = await fetch(`${this.baseUrl}/posts/${postId}`, {
            method: "delete",
        })

        return response.json()
    }
}
