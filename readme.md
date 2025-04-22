tem um dockerfile com um servidor dentro da pasta server
    ele fica na porta 3000
tem um main.jsx que é o nosso frontend
    ele fica na porta 5173
    tem 3 paginas nessa mock
        register: aonde é registrado o seu login
            se faltar nome, senha ou já estiver registrado ele avisa
        login:
            recebe nome e senha se não existir ou estiver errado avisa
            além disso se estiver certo recebe uma autenticação do servidor para permitir qualquer ato no display
        display:
            permite a criação deleção e atualização do estado de uma task
suba o docker-composer com:
    docker compose -f 'docker-composer.yaml' up -d --build 

vá para http://localhost:5173 para acessar a aplicação