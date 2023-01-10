let form = document.querySelector('form');
async function Post(){
    let data = {
        title: form.title.value,
        description: form.title.value,
        fulltext: form.fulltext.value,
        date: new Date()
    }
    if (form.title.value!="" && form.description.value!=""){
        await fetch('http://localhost:8080/api/blogs', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }).then(res=>{return res.json()}).then(_data=>{
            console.log(_data);
            if (_data.insertedId!=""){
                alert('Successful upload!')
                window.location.reload();
            }
        });
    }
    else{
        document.querySelector('#alert').classList.remove('alert-success');
        document.querySelector('#alert').classList.add('alert-danger');
        document.querySelector('#alert').innerHTML = "The required fields are needed to be filled!";
        document.querySelector('#alert').classList.remove('d-none');
    }
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
async function SubmitMod(){
    let fm = document.querySelector('#mod')
    let data = {
        title: fm.title.value,
        description: fm.description.value,
        fulltext: fm.fulltext.value,
    }
    await fetch('http://localhost:8080/api/blogs/'+document.querySelector('#modid').innerText, {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(data)
    }).then(res=>res.json()).then(_data=>{
        console.log(_data);
    })
}
async function Delete(id){
    await fetch('http://localhost:8080/api/blogs/'+id, {
        method:'DELETE',
        headers:{'Content-Type':'application/json'}
    }).then(res=>{return res.json();}).then(_data=>{
        console.log(_data)
        if (_data.deletedCount>0) document.querySelector('#_'+id).remove();
    });
}
async function Mod(id){
    let fm = document.querySelector('#mod')
    await fetch('http://localhost:8080/api/blogs/'+id, {
        method:'GET',
        headers:{'Content-Type':'application/json'}
    }).then(res=>{return res.json();}).then(_data=>{
        let post = _data[0];
        document.querySelector('#modid').innerHTML = post._id;
        fm.id.value = post._id;
        fm.title.value = post.title;
        fm.description.value = post.description;
        fm.fulltext.value = post.fulltext;
        console.log(fm)
    })
}
document.querySelector('#post').addEventListener('click', Post);