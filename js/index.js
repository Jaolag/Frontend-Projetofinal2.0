document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("botao-formulario");
  const formulario = document.getElementById("form-cadastro");
  const searchInput = document.querySelector(".search");

  const token = localStorage.getItem("token_tarefas");
  if (!token) {
    // Redireciona para a página de login
    window.location.href = "home.html";
    return;
  }

  searchInput.addEventListener("input", function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const tarefaCards = document.querySelectorAll(".tarefa-card");

    tarefaCards.forEach(function (card) {
      const titulo = card.querySelector(".tarefa-titulo").textContent.toLowerCase();
      const descricao = card.querySelector(".tarefa-descricao").textContent.toLowerCase();

      if (titulo.includes(searchTerm) || descricao.includes(searchTerm)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
  botao.addEventListener("click", function () {
    formulario.style.display = "block";
    botao.style.display = "none";

  });
});
const baseURL = 'https://projetofinalws.onrender.com/api/tarefas';
const token = `Bearer ${localStorage.getItem("token_tarefas")}`;

document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("botao-formulario");
  const formulario = document.getElementById("form-cadastro");

  botao.addEventListener("click", function () {
    formulario.style.display = "block";
    botao.style.display = "none";
  });
});


///

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("form-cadastro");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário de recarregar a página

    const titulo = document.getElementById("titulo").value;
    const descricao = document.querySelector(".descricao").value;

    // Cria um objeto com os dados da tarefa
    const tarefa = {
      titulo: titulo,
      descricao: descricao
    };

    // Envia a requisição POST para o backend
    fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(tarefa)
    })
      .then(response => {
        if (response.ok) {
          // Recarrega a página após a requisição POST ser concluída com sucesso
          location.reload();
        } else {
          throw new Error("Erro ao enviar a tarefa");
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
  ///funcao deletar tarefas 
  function excluirTarefa(tarefaId) {
    // Envia a solicitação DELETE para o backend
    fetch(`${baseURL}/${tarefaId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token
      }
    })
      .then(response => {
        if (response.ok) {
          // Recarrega a página após a tarefa ser excluída com sucesso
          location.reload();
        } else {
          throw new Error("Erro ao excluir a tarefa");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  // Função para obter e exibir as tarefas cadastradas
  function exibirTarefasCadastradas() {
    fetch(baseURL, {
      headers: {
        "Authorization": token
      }
    })
      .then(response => response.json())
      .then(data => {
        const tarefasCadastradas = document.getElementById("tarefas-cadastradas");
        tarefasCadastradas.innerHTML = ""; // Limpa o conteúdo existente

        data.forEach(tarefa => {
          const tarefaCard = document.createElement("div");
          tarefaCard.classList.add("tarefa-card"); // Adiciona a classe "tarefa-card" ao elemento

          const tituloElement = document.createElement("h5");
          tituloElement.textContent = tarefa.titulo;
          tituloElement.classList.add("tarefa-titulo"); // Adiciona a classe "tarefa-titulo" ao elemento

          const descricaoElement = document.createElement("p");
          descricaoElement.textContent = tarefa.descricao;
          descricaoElement.classList.add("tarefa-descricao"); // Adiciona a classe "tarefa-descricao" ao elemento

          //eddicao
          // Criar o elemento do ícone de edição
          // Criar o elemento do botão de edição
          const editButton = document.createElement("button");
          editButton.textContent = "Editar";

          // Adiciona um evento de clique ao botão de edição
          editButton.addEventListener("click", function () {
            // Aqui você pode implementar a lógica para editar a tarefa
            console.log("Editar tarefa: ", tarefa.id);
          });

          // Cria um elemento de container para o botão de edição
          const editContainer = document.createElement("div");
          editContainer.classList.add("edit-button-container");
          editContainer.appendChild(editButton);

          tarefaCard.appendChild(editContainer); // Adiciona o container do botão de edição ao card
          ;


          ///// Cria o elemento do ícone de lixeira



          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Excluir";
          
          // Adiciona um evento de clique ao botão de exclusão
          deleteButton.addEventListener("click", function () {
            if (confirm("Você realmente deseja excluir esta tarefa?")) {
              excluirTarefa(tarefa.id);
            }
          });
          
          const deleteContainer = document.createElement("div");
          deleteContainer.classList.add("delete-button-container");
          deleteContainer.appendChild(deleteButton);
          
          // Adiciona o botão de exclusão após o conteúdo do card
          tarefaCard.appendChild(editContainer);
          tarefaCard.appendChild(tituloElement);
          tarefaCard.appendChild(descricaoElement);
          tarefaCard.appendChild(deleteContainer);
          editButton.addEventListener("click", function () {
            const novoTitulo = prompt("Digite o novo título da tarefa:");
            const novaDescricao = prompt("Digite a nova descrição da tarefa:");

            const tarefaAtualizada = {
              titulo: novoTitulo,
              descricao: novaDescricao
            };

            fetch(`${baseURL}/${tarefa.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": token
              },
              body: JSON.stringify(tarefaAtualizada)
            })
              .then(response => {
                if (response.ok) {
                  // Recarrega a página após a requisição PUT ser concluída com sucesso
                  location.reload();
                } else {
                  throw new Error("Erro ao atualizar a tarefa");
                }
              })
              .catch(error => {
                console.error(error);
              });
          });

          // Insere a tarefa no início da lista
          tarefasCadastradas.prepend(tarefaCard);
        });
      })
      .catch(error => {
        console.error(error);
      });
  }
  function logout() {
    
    localStorage.clear()
    window.location.replace("login.html")
  }
  const sairButton = document.querySelector(".sair");
  sairButton.addEventListener("click", logout);
  // Chama a função para exibir as tarefas cadastradas ao carregar a página
  exibirTarefasCadastradas();
});