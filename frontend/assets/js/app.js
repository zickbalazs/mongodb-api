let form = document.querySelector('form');
async function Post(){
    let data = {
        title: form.title.value,
        description: form.title.value,
        fulltext: form.fulltext.value,
        date: new Date()
    }
    await fetch('http://localhost:8080/api/blogs', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }).then(res=>console.log(res));
}
document.querySelector('#editSwitch').addEventListener('click', ()=>{
    $('#adder').fadeOut(250, ()=>{
        $('#edit').fadeIn();
    })
})
document.querySelector('#addSwitch').addEventListener('click', ()=>{
    $('#edit').fadeOut(250, ()=>{
        $('#adder').fadeIn();
    })
})
function asd(){
    console.log('asd');
}
document.querySelector('#post').addEventListener('click', Post);