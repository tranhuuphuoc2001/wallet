let w = window.localStorage.getItem('wallet')
var data = w ? JSON.parse(w) : [
    {
        Wallet: 'Tien mat',
        List:[
            {Type:'Income',Money:150000,Description:'Scholarship',Date:'2001-10-22'},
            {Type:'Expense',Money:2000000,Description:'New shoes',Date:'2001-10-10'},
            {Type:'Expense',Money:2500000,Description:'New Shirt',Date:'2001-10-10'},
            {Type:'Income',Money:3500000,Description:'Mom',Date:'2001-10-10'},
        ]
    },
    {
        Wallet: 'Vietcombank',
        List:[
            {Type:'Income',Money:200000,Description:'Salary',Date:'2001-05-16'},
            {Type:'Expense',Money:100000,Description:'Intend wedding',Date:'2001-07-21'},
        ]
    },
   
]
let walletElement = document.querySelector('.wallet')
let walletListElement = document.querySelector('.walletList')
let walletDetailElement = document.querySelector('.walletDetail')
let detailElement = document.querySelector('.detail')
render()
let curIndex = 0
window.localStorage.setItem('wallet',JSON.stringify(data))
function render(){
    walletListElement.innerHTML =''
    data.forEach((wallet,index) => {
        wallet.List.sort((after,before)=>{
            var dateA = new Date(after.Date)
            var dateB = new Date(before.Date)
            return dateA-dateB
        })
        let pElement = document.createElement('p')
        pElement.classList.add('walletItem')
        pElement.innerHTML =  `<p>${wallet.Wallet}</p><div><button type="button" class="btn btn-danger" onclick="delWallet(${index})">Delete Wallet</button>
        <button type="button" class="btn btn-info" onclick="showAddAction(${index})" data-bs-toggle="modal" data-bs-target="#exampleModal" > Add Income/Expense </button>
        <button type="button" class="btn btn-primary" onclick="changeWallet(${index})" data-bs-toggle="modal" data-bs-target="#exampleModal"">Update Wallet</button></div>`
        pElement.onclick=function(e){
            let d = document.querySelector('.active')
            if(d){
                d.classList.remove('active')
            }
            pElement.classList.add('active')
            curIndex = index
            renderDetail(curIndex)
        }
        walletListElement.append(pElement)
    });
}
function renderDetail(index){
    detailElement.innerHTML = ''
    let [totalIncome,totalExpense] = [0,0]
    data[index].List.forEach((list,i)=>{
        if(list.Type == 'Income')
            totalIncome+= list.Money*1
        else    
            totalExpense+= list.Money*1
        if(i == 0 || list.Date != data[index].List[i-1].Date){
            let divDay = document.createElement('div')
            divDay.classList.add('daily')
            let total = 0
            data[index].List.forEach(l=>{
                if(l.Date == list.Date){
                    total += l.Type == 'Income' ? l.Money*1 : -l.Money*1
                }
            })
            divDay.innerHTML=`<b>${new Date(list.Date).toLocaleDateString()}</b><p>${total.toLocaleString()}</p>`
            detailElement.append(divDay)
        }
        let divE = document.createElement('div')
        divE.classList.add(`${list.Type}`)
        divE.innerHTML =`<div class="upActionDiv actionContain" data-bs-toggle="modal" data-bs-target="#exampleModal"><p class="pDetail">${list.Description}</p>
        <p class="pMoney">${(list.Money*1).toLocaleString()}<p></div> <button onclick="deleteAction(${index}, ${i})" class='btn btn-danger'>X</button>`
        divE.querySelector('.upActionDiv').onclick = ()=>{
                showUpdateAction(index,list.Type,list.Money,list.Description,list.Date,i)
            }
        detailElement.append(divE)

        
    })
    document.querySelector('.in-money').innerText = totalIncome.toLocaleString()
    document.querySelector('.out-money').innerText = totalExpense.toLocaleString()
    document.querySelector('.remain').innerText = (totalIncome-totalExpense).toLocaleString()
}
//CRUD
//wallet
function addWallet () {
    const walletName = document.querySelector('.walletName').value
    const actionType = document.querySelector('.actionType').value
    const actionMoney = document.querySelector('.actionMoney').value
    const actionDate = document.querySelector('.actionDate').value
    const actionDes = document.querySelector('.actionDes').value
    let existArr = data.filter(d=>d.Wallet == walletName)
    if(walletName){
      if(!existArr.length){
        document.querySelector('.closeBtn').click()
        document.querySelector('.error').innerHTML = ''
        data.push({Wallet: walletName,
        List:[{Type:actionType,Money:actionMoney,Description:actionDes,Date:actionDate}]})
        window.localStorage.setItem('wallet',JSON.stringify(data))
        render()
        curIndex = data.length-1
        renderDetail(curIndex)
        }else{
            document.querySelector('.error').innerHTML = 'Wallet nay da ton tai'
        }
    }else{
      document.querySelector('.error').innerHTML = 'Dien ten Wallet'
  }
}
function delWallet(index){
    let check = confirm(`co chac muon xoa wallet: ${data[index].Wallet}`)
    if(check){
        document.querySelector('.error').innerHTML = ''
        data = data.filter((e,i)=>i!=index)
        window.localStorage.setItem('wallet',JSON.stringify(data))
        render()
        renderDetail(0)
    }
}
function upWallet(){
    const modaltitle = document.querySelector('.modal-title').innerText
    const walletName = document.querySelector('.walletName').value
    if(walletName){
        data.forEach(e=>{
            if(e.Wallet == modaltitle){
                e.Wallet = walletName
                e.AliasWallet = walletName.split(' ').join('_')
                document.querySelector('.closeBtn').click()
                document.querySelector('.error').innerHTML = ''
                window.localStorage.setItem('wallet',JSON.stringify(data))
                render()
            }
        })
    }else{
        document.querySelector('.error').innerHTML = 'Khong up date dc khi de trong'
    }
}
//action
function addNewAction(){
    const walletName = document.querySelector('.modal-title').innerText
    const actionType = document.querySelector('.actionType').value
    const actionMoney = document.querySelector('.actionMoney').value
    const actionDes = document.querySelector('.actionDes').value
    const actionDate = document.querySelector('.actionDate').value
    let existArr = data.filter(d=>d.Wallet == walletName)
                if(actionMoney && actionDes && actionDate){
                    existArr[0].List.push({Type:actionType,Money:actionMoney,Description:actionDes,Date:actionDate})
                    window.localStorage.setItem('wallet',JSON.stringify(data))
                    renderDetail(curIndex)
                    document.querySelector('.closeBtn').click()
                }else{
                    document.querySelector('.errorAction').innerHTML = 'Dien du thong tin'
                }
}
function deleteAction(walletIndex,actionIndex){
    data[walletIndex].List.splice(actionIndex,1)
    window.localStorage.setItem('wallet',JSON.stringify(data))
    renderDetail(curIndex)
}
function updateAction(){
    var wallet = document.querySelector('.modal-title').innerText
    var actionType = document.querySelector('.actionType').value
    var actionMoney = document.querySelector('.actionMoney').value
    var actionDes = document.querySelector('.actionDes').value
    var actionDate = document.querySelector('.actionDate').value
    var index = document.querySelector('.actionIndex').innerText
    data.forEach(d=>{
        if(actionMoney && actionDes && actionDate){
            if(d.Wallet == wallet){
                d.List[index].Type = actionType
                d.List[index].Money = actionMoney
                d.List[index].Description = actionDes
                d.List[index].Date = actionDate
                window.localStorage.setItem('wallet',JSON.stringify(data))
                renderDetail(curIndex)
                document.querySelector('.errorAction').innerHTML = ''
                document.querySelector('.closeBtn').click()
            }
        }else{
            document.querySelector('.errorAction').innerHTML = 'Khong up date dc khi de trong'
        }
    })
}
//show Modal
function changeWallet(e){
    document.querySelector('.delAndUp').style.display = 'block'
    document.querySelector('.addWallet').style.display = 'none'
    document.querySelector('.addWalletName').style.display = 'block'
    document.querySelector('.addWalletAction').style.display = 'none'
    document.querySelector('.addAction').style.display = 'none'
    document.querySelector('.upAction').style.display = 'none'
    document.querySelector('.error').innerHTML = ''
    document.querySelector('.errorAction').innerHTML = ''
    const walletName = document.querySelector('.walletName')
    const modaltitle = document.querySelector('.modal-title')
    modaltitle.innerText = data[e].Wallet
    walletName.value = data[e].Wallet;
}
function showAddModal(){
    document.querySelector('.addWallet').style.display = 'block'
    document.querySelector('.addWalletName').style.display = 'block'
    document.querySelector('.addWalletAction').style.display = 'block'
    document.querySelector('.addAction').style.display = 'none'
    document.querySelector('.delAndUp').style.display = 'none'
    document.querySelector('.upAction').style.display = 'none'
    document.querySelector('.error').innerHTML = ''
    document.querySelector('.errorAction').innerHTML = ''
    document.querySelector('.modal-title').innerText = 'Add a new Wallet'
    document.querySelector('.walletName').value =''
    document.querySelector('.actionType').value ='Income'
    document.querySelector('.actionMoney').value =''
    document.querySelector('.actionDes').value =''
    document.querySelector('.actionDate').value =''
}
function showAddAction(e){
    document.querySelector('.addAction').style.display = 'block'
    document.querySelector('.addWalletAction').style.display = 'block'
    document.querySelector('.addWallet').style.display = 'none'
    document.querySelector('.addWalletName').style.display = 'none'
    document.querySelector('.delAndUp').style.display = 'none'
    document.querySelector('.upAction').style.display = 'none'
    document.querySelector('.error').innerHTML = ''
    document.querySelector('.errorAction').innerHTML = ''
    document.querySelector('.actionType').value ='Income'
    document.querySelector('.actionMoney').value =''
    document.querySelector('.actionDes').value =''
    document.querySelector('.actionDate').value =''
    var title = data[e].Wallet
    document.querySelector('.modal-title').innerText = title

}
function showUpdateAction(indexWallet,type,money,des,date,index){
    document.querySelector('.addAction').style.display = 'none'
    document.querySelector('.upAction').style.display = 'block'
    document.querySelector('.addWalletAction').style.display = 'block'
    document.querySelector('.addWallet').style.display = 'none'
    document.querySelector('.addWalletName').style.display = 'none'
    document.querySelector('.delAndUp').style.display = 'none'
    document.querySelector('.error').innerHTML = ''
    document.querySelector('.errorAction').innerHTML = ''
    document.querySelector('.actionType').value = type
    document.querySelector('.actionMoney').value =money
    document.querySelector('.actionDes').value = des
    document.querySelector('.actionDate').value = date
    document.querySelector('.actionIndex').innerText =index
    document.querySelector('.modal-title').innerText = data[indexWallet].Wallet
}