import { importMarkdowns, convertToPostPreview } from "$lib/data/handle-markdown"

let postFiles = importMarkdowns("src/posts/")

export function get() {
    let posts = postFiles.map((file) => convertToPostPreview(file));
    let body = JSON.stringify(posts);

    return {body}
}