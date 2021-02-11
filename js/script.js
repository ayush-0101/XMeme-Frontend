let baseUrl = "http://localhost:8081";

let getAllMemePosts = async () => {
    let reqUrl = baseUrl + "/memes";
    let response = await fetch(reqUrl);
    if (response.ok) {
        response = await response.json();
    }
    return response;
};

let populateMemePost = (post) => {
    $(".memes-display").append(
        '<div class="meme-container">\n' +
            '<div class="meme-heading">\n' +
                '<p><span class="underline">Added By:</span> ' + post.name + '</p>\n' +
            '</div>\n' +
            '<hr>\n' +
            '<div class="meme-image">\n' +
                '<img src="'+ post.url + '" alt="Meme image">\n' +
            '</div>\n' +
            '<hr>\n' +
            '<div class="meme-footer">\n' +
                '<p><span class="underline">Caption:</span> ' + post.caption + '</p>\n' +
            '</div>\n' +
        '</div>'
    );
};

let postMeme = async (name, url, caption) => {
    let reqUrl = baseUrl + "/memes";
    let response = await fetch(reqUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            url: url,
            caption: caption
        })
    });
    if (response.ok) {
        response = await response.json();
    }
    return response;
};

$(document).ready(() => {
    $(".post-meme").on("submit", (event) => {
        event.preventDefault();
        let name = $(".form-field-name").val();
        let url = $(".form-field-url").val();
        let caption = $(".form-field-caption").val();
        postMeme(name, url, caption).then(response => {
            console.log(response);
            if (response.status === undefined) {
                alert("Meme posted successfully");
                window.location.reload();
            } else {
                alert("Error occurred in posting the meme.");
            }
        })
    });

    getAllMemePosts().then(response => {
        if (response.status === undefined) {
            response.forEach(post => {
                populateMemePost(post);
            })
        } else {
            $(".memes-display").append('<h3 style="color: red">Error fetching memes from the server!</h3>');
        }
    });
});