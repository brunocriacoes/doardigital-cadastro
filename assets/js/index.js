
function getDados(){
    let form = document.formulario
    return {
        cpf_cnpj: form.cpf_cnpj.value,
        nome: form.name.value,
        email: form.email.value,
        telefone: form.phone.value,
        password: form.password.value,
        password_confirm: form.password_confirm.value,
        type_user: form.cpf_cnpj.value.replace(/\D/gi, '').length > 11 ? 'juridica' : 'fisica',
        ativo: false,
        instituicao_id: null,
        credencial: null,
        vendendor_id: null 
    }


}

function validarPass( data ) {
    if( data.password.length < 6 ) return 'a senha deve ter ao menos 6 digitos'
    if( data.password != data.password_confirm ) return 'a senhas deve ser iguais'
    return ''
}

function closeError() {
    document.querySelector('.js-alert').innerHTML = ""
}

function onError( message ) {
    document.querySelector('.js-alert').innerHTML = `<p onclick="globalThis.closeError()" class="alert">${message} </p>`
}

async function cadastrar() {
    closeError()
    if( validarPass( getDados() ).length > 0 ) return onError( validarPass( getDados() ) )
    let register = await SuperRegisterAdmin(getDados())
    if( register.status ) return onError( register.message )
    window.location.href = `http://padrao.doardigital.com.br/painel/#/cadastrado-sucesso/${register.token.access_token}`
    
}

function maskTel( $el ) {
    let mascara = $el.value
    mascara = mascara.replace(/\D/gi, '')
    mascara = mascara.replace(/(\d{2})(.*)/gi, '($1) $2')
    mascara = mascara.replace(/\((\d{2})\)\s(\d{1})(.*)/gi, '($1) $2 $3')
    mascara = mascara.replace(/\((\d{2})\)\s(\d{1})\s(\d{4})(.*)/gi, '($1) $2 $3-$4')
    mascara = mascara.replace(/\((\d{2})\)\s(\d{1})\s(\d{4})-(\d{4})(.*)/gi, '($1) $2 $3-$4')
    $el.value = mascara
}

function cpf( mascara ) {
    // 000.000.000-00
    mascara = mascara.replace(/(\d{3})(.*)/gi, '$1.$2')
    mascara = mascara.replace(/(\d{3})\.(\d{3})(.*)/gi, '$1.$2.$3')
    mascara = mascara.replace(/(\d{3})\.(\d{3})\.(\d{3})(.*)/gi, '$1.$2.$3-$4')
    mascara = mascara.replace(/(\d{3})\.(\d{3})\.(\d{3})\-(\d{2})(.*)/gi, '$1.$2.$3-$4')

    return mascara
}
function cnpj( mascara ) {
    mascara = mascara.replace(/(\d{2})(.*)/gi, '$1.$2')
    mascara = mascara.replace(/(\d{2})\.(\d{3})(.*)/gi, '$1.$2.$3')
    mascara = mascara.replace(/(\d{2})\.(\d{3})\.(\d{3})(.*)/gi, '$1.$2.$3/$4')
    mascara = mascara.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(.*)/gi, '$1.$2.$3/$4-$5')
    mascara = mascara.replace(/(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})\-(\d{2})(.*)/gi, '$1.$2.$3/$4-$5')

    return mascara
}

function mask_cpf_cnpj( $el ) {
    let mascara = $el.value
    mascara = mascara.replace(/\D/gi, '')
    if(mascara.length > 11 ) {
        mascara = cnpj(mascara)
    }else {
        mascara = cpf(mascara)
    }   
    $el.value = mascara
}

function obj_to_url(obj) {
    let indices = Object.keys(obj);
    let url = indices.map(i => `${i}=${obj[i]}`).join('&');
    // return url;
    return encodeURI(url);
}

async function SuperRegisterAdmin(dados) {
    let base = '//api.doardigital.com.br/v1/cadastro'
    let options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        body: obj_to_url(dados)
    }
    return await (await fetch( base, options )).json()
}


// XX. XXX. XXX/0001-XX

globalThis.cadastrar = cadastrar
globalThis.closeError = closeError
globalThis.maskTel = maskTel
globalThis.mask_cpf_cnpj = mask_cpf_cnpj