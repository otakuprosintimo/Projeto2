const loadingElement = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")
const botao = document.querySelector("#botaobuscar")
const url = "https://jsonplaceholder.typicode.com/posts"
//pegar a url
const urlParametros = new URLSearchParams(window.location.search)
const postid = urlParametros.get("id")
const comentariosContainer = document.querySelector("#comentarios-container")
const comentarioform = document.querySelector("#comentarios-form")
const emailinput = document.querySelector("#email")
const comentarioinput = document.querySelector("#coment")

if (!postid) {
    getallposts()
}
else {
    getpostespecific(postid)

    comentarioform.addEventListener("submit", (e) => {
        e.preventDefault()

        let comentarioinserido = {
            email: emailinput.value,
            body: comentarioinput.value,
        }
        comentarioinserido = JSON.stringify(comentarioinserido)       
        postcomentario(comentarioinserido)
    })
}

async function getallposts() {
    const resposta = await fetch(url)

    const data = await resposta.json()
    console.log(resposta)

    loadingElement.classList.add("hide")
        -
        data.map((postagem) => {
            const div = document.createElement("div")
            const title = document.createElement("h2")
            const body = document.createElement("p")
            const link = document.createElement("a")

            title.innerText = postagem.title
            body.innerText = postagem.body
            link.innerText = "Ler"
            link.setAttribute("href", './post.html?id=' + postagem.id)

            div.appendChild(title)
            div.appendChild(body)
            div.appendChild(link)
            postsContainer.appendChild(div)
        })
}

async function getpostespecific(id) {
    //const resposta = await fetch(`${url}/${id}`)
    //const respostacomentario = await fetch(`${url}/${id}/comments`)
    const [resposta, respostacomentario] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`),
    ])

    const datapostagem = await resposta.json()
    const datacomentario = await respostacomentario.json()
    loadingElement.classList.add("hide")

    const title = document.createElement("h1")
    const body = document.createElement("p")

    title.innerText = datapostagem.title
    body.innerText = datapostagem.body

    postsContainer.appendChild(title)
    postsContainer.appendChild(body)

    datacomentario.map((comentario) => {
        criarcomentario(comentario)
    })
}

function criarcomentario(comentario) {
    const divcomentario = document.createElement("div")
    const email = document.createElement("h3")
    const paragrafocomentario = document.createElement("p")

    email.innerHTML = comentario.email
    paragrafocomentario.innerText = comentario.body

    divcomentario.appendChild(email)
    divcomentario.appendChild(paragrafocomentario)
    comentariosContainer.appendChild(divcomentario)
}

async function postcomentario(comentario) {
    const resp = await fetch(url, {
        method: "POST",
        body: comentario,
        headers: {
            "Content-type": "application/json"
        }
    })
    const dataresposta = await resp.json()
    criarcomentario(dataresposta)
}