let baseUrl = "https://xmeme-back-end.herokuapp.com";

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
        '<div class="meme-post-full">\n' +
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
            '</div>\n' +
            '<div class="options-container">\n' +
                '<div class="hidden">' + post.id + '</div>\n' +
                '<span class="delete-post">Delete</span>\n' +
                '<span class="edit-post">Edit</span>\n' +
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

let deleteMeme = async (id) => {
    let reqUrl = baseUrl + "/memes/" + id;
    return await fetch(reqUrl, {
        method: "DELETE"
    });
}

let getMemePostById = async (id) => {
    let reqUrl = baseUrl + "/memes/" + id;
    let response = await fetch(reqUrl);
    if (response.ok) {
        response = await response.json();
    }
    return response;
};

let updateMemePostById = async (id, url, caption) => {
    let reqUrl = baseUrl + "/memes/" + id;
    let reqBody;
    if (url !== "" && caption !== "") {
        reqBody = {
            url: url,
            caption: caption
        };
    } else if (url !== "") {
        reqBody = {
            url: url
        };
    } else {
        reqBody = {
            caption: caption
        };
    }
    console.log(reqBody);
    return await fetch(reqUrl, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reqBody)
    });
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
                alert("Error occurred in posting the meme");
            }
        });
    });

    $(".memes-display").on("click", ".delete-post", (event) => {
        let id = $(event.target).prev().html();
        deleteMeme(id).then(response => {
            console.log(response);
            if (response.ok) {
                $(event.target).parent().parent().remove();
                alert("Meme deleted successfully");
            } else {
                alert("Error occurred in deleting the meme");
            }
        });
    });

    $(".memes-display").on("click", ".edit-post", (event) => {
        let currElem = $(event.target);
        let id = currElem.prev().prev().html();
        console.log("id = " + id);
        let optionsDiv = currElem.parent();
        optionsDiv.find(".delete-post").remove();
        optionsDiv.find(".edit-post").remove();
        optionsDiv.append('<span class="close-edit-form">Close</span>');
        let memeContainerElem = optionsDiv.parent().find(".meme-container");
        memeContainerElem.empty();
        memeContainerElem.append('' +
            '<div class="edit-form">\n' +
                '<p class="post-meme-header">Edit this meme</p>\n' +
                '<form class="edit-meme">\n' +
                    '<input class="form-field form-field-url" type="text" placeholder="URL of the image">\n' +
                    '<textarea class="form-field form-field-caption form-field-edit-textarea" placeholder="Caption for the image"></textarea>\n' +
                    '<input class="form-submit edit-form-submit" type="submit">\n' +
                '</form>\n' +
            '</div>'
        );
    });

    $(".memes-display").on("click", ".close-edit-form", (event) => {
        let currElem = $(event.target);
        let id = currElem.parent().find(".hidden").html();
        getMemePostById(id).then(response => {
            console.log(response);
            if (response.status === undefined) {
                let memePostFull = currElem.parent().parent();
                memePostFull.empty();
                memePostFull.append(
                    '<div class="meme-container">\n' +
                        '<div class="meme-heading">\n' +
                            '<p><span class="underline">Added By:</span> ' + response.name + '</p>\n' +
                        '</div>\n' +
                        '<hr>\n' +
                        '<div class="meme-image">\n' +
                            '<img src="'+ response.url + '" alt="Meme image">\n' +
                        '</div>\n' +
                        '<hr>\n' +
                        '<div class="meme-footer">\n' +
                            '<p><span class="underline">Caption:</span> ' + response.caption + '</p>\n' +
                        '</div>\n' +
                    '</div>\n' +
                    '<div class="options-container">\n' +
                        '<div class="hidden">' + response.id + '</div>\n' +
                        '<span class="delete-post">Delete</span>\n' +
                        '<span class="edit-post">Edit</span>\n' +
                    '</div>\n'
                );
            } else {
                alert("Error occurred in fetching the current post");
            }
        });
    });

    $(".memes-display").on("submit", ".edit-meme", (event) => {
        event.preventDefault();
        let currElem = $(event.target);
        let id = currElem.parent().parent().parent().find(".hidden").html();
        let url = currElem.find(".form-field-url").val();
        let caption = currElem.find(".form-field-caption").val();
        if (url !== "" || caption !== "") {
            updateMemePostById(id, url, caption).then(response => {
                console.log(response);
                if (response.ok) {
                    getMemePostById(id).then(res => {
                        console.log(res);
                        if (res.status === undefined) {
                            let memePostFull = currElem.parent().parent().parent();
                            memePostFull.empty();
                            memePostFull.append(
                                '<div class="meme-container">\n' +
                                '<div class="meme-heading">\n' +
                                '<p><span class="underline">Added By:</span> ' + res.name + '</p>\n' +
                                '</div>\n' +
                                '<hr>\n' +
                                '<div class="meme-image">\n' +
                                '<img src="' + res.url + '" alt="Meme image">\n' +
                                '</div>\n' +
                                '<hr>\n' +
                                '<div class="meme-footer">\n' +
                                '<p><span class="underline">Caption:</span> ' + res.caption + '</p>\n' +
                                '</div>\n' +
                                '</div>\n' +
                                '<div class="options-container">\n' +
                                '<div class="hidden">' + res.id + '</div>\n' +
                                '<span class="delete-post">Delete</span>\n' +
                                '<span class="edit-post">Edit</span>\n' +
                                '</div>\n'
                            );
                            alert("Successfully updated the post");
                        } else {
                            alert("Error occurred in fetching the current post");
                        }
                    });
                } else {
                    alert("Error updating the post");
                }
            });
        } else {
            alert("Both fields can't be empty");
        }
    });

    getAllMemePosts().then(response => {
        if (response.status === undefined) {
            console.log(response);
            response.forEach(post => {
                populateMemePost(post);
            })
        } else {
            $(".memes-display").append('<h3 style="color: red">Error fetching memes from the server!</h3>');
        }
    });
});