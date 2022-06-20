export class Usuario {



    static async cadastroUsuariosWeb(e) {
        e.preventDefault()

        const inputNome = document.getElementById("nome").value
        const inputEmail = document.getElementById("email").value
        const inputFoto = document.getElementById("foto").value
        const inputSenha = document.getElementById("senha").value


        const objUsuarioCriacao = {


            username: `${inputNome}`,
            email: `${inputEmail}`,
            avatarUrl: `${inputFoto}`,
            password: `${inputSenha}`
        }

        const cadUsuario = await Usuario.cadastroNovoUsuario(objUsuarioCriacao)

        if (cadUsuario != null)
            window.location = 'http://127.0.0.1:5501/login.html'

    }

    static async cadastroNovoUsuario(usuario) {
        const response = await fetch(

                "https://api-blog-m2.herokuapp.com/user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuario),


                })
            .then((res) => res.json())
            .then((res) => { console.log(res); return res })
            .catch((error) => error);
        return response;
    }

    static async loginUsuariosWeb(e) {


        e.preventDefault()

        const inputEmail = document.getElementById("email").value
        const inputSenha = document.getElementById("senha").value


        const objUsuarioLogin = {
            email: `${inputEmail}`,
            password: `${inputSenha}`
        }

        const retornoLogin = await Usuario.fazerLogin(objUsuarioLogin)
        if (retornoLogin != null) {
            localStorage.setItem('token', retornoLogin.token);
            localStorage.setItem('userId', retornoLogin.userId);
            window.location = 'http://127.0.0.1:5501/pagina-principal.html'
        }

    }

    static async fazerLogin(usuario) {
        const token = await fetch(
                "https://api-blog-m2.herokuapp.com/user/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuario),
                })
            .then((res) => res.json())
            .then((res) => { console.log(res); return res })
            .catch((error) => error);

        Usuario.token = token

        return token;
    }

    static async criarPost(post) {

        const token = `Bearer ${window.localStorage.getItem("token")}`


        const response = await fetch(
                "https://api-blog-m2.herokuapp.com/post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token

                    },
                    body: JSON.stringify(post),
                })
            .then((res) => res.json())
            .then((res) => res)

        return response;
    }

    static async criarPostWeb(e) {
        e.preventDefault()
        const valorTextArea = document.getElementById("textarea").value

        const objUsuarioPost = {

            "content": `${valorTextArea}`
        }
        const objPost = await Usuario.criarPost(objUsuarioPost)



        const ul = document.createElement("ul")
        ul.id = 'ul-' + objPost.id

        const li = document.createElement("li")
        li.id = 'li-' + objPost.id
        li.className = "liPost"


        const btnEditar = document.createElement("button")
        btnEditar.id = objPost.id
        btnEditar.innerHTML = 'Editar'
        btnEditar.addEventListener('click', Usuario.editarPostWeb)

        const btnApagar = document.createElement("button")
        btnApagar.id = objPost.id
        btnApagar.innerHTML = 'Apagar'
        btnApagar.addEventListener('click', Usuario.apagarPostWeb)

        const textArea = document.createElement("textarea")
        textArea.id = 'textArea' + objPost.id
        textArea.value = objPost.post

        const divGeral = document.getElementById("divTexto")

        divGeral.appendChild(ul)
        ul.appendChild(li)
        li.appendChild(textArea)
        li.appendChild(btnEditar)
        li.appendChild(btnApagar)

        document.getElementById("textarea").value = ""


    }


    static async editarPostWeb(e) {
        e.preventDefault()

        const idPost = e.target.id



        const valorTextArea = document.getElementById("textArea" + idPost).value

        const objUsuarioPost = {

            "newContent": `${valorTextArea}`
        }





        const objPost = await Usuario.editarPost(idPost, objUsuarioPost)


    }


    static async editarPost(idPost, post) {

        const token = `Bearer ${window.localStorage.getItem("token")}`


        const response = await fetch(
                "https://api-blog-m2.herokuapp.com/post/" + idPost, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token

                    },
                    body: JSON.stringify(post),
                })
            .then((res) => res.json())
            .then((res) => res)

        return response;
    }


    static async apagarPostWeb(e) {
        e.preventDefault()

        const idPost = e.target.id



        const objPost = await Usuario.apagarPost(idPost)



        const ul = document.getElementById("ul-" + idPost)

        const li = document.getElementById("li-" + idPost)

        ul.removeChild(li);
    }


    static async apagarPost(idPost) {

        const token = `Bearer ${window.localStorage.getItem("token")}`


        const response = await fetch(
                "https://api-blog-m2.herokuapp.com/post/" + idPost, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token

                    }
                })
            .then((res) => res)

        return response;
    }

}