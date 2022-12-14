var employeeList = [];

function resetForm(){
  document.getElementById("tknv").disabled = false;
  document.getElementById("myform").reset();
  document.getElementById("btnThemNV").style.display = "block";
  document.getElementById("btnCapNhat").style.display = "none";
  document.getElementById("tbTKNV").style.display = "none";
  document.getElementById("tbTen").style.display = "none";
  document.getElementById("tbEmail").style.display = "none";
  document.getElementById("tbMatKhau").style.display = "none";
  document.getElementById("tbNgay").style.display = "none";
  document.getElementById("tbLuongCB").style.display = "none";
  document.getElementById("tbChucVu").style.display = "none";
  document.getElementById("tbGiolam").style.display = "none";

}

function validateForm(){

var employeeId = document.getElementById("tknv").value;
var employeeName = document.getElementById("name").value;
var employeeEmail = document.getElementById("email").value;
var employeePassword = document.getElementById("password").value;
var employeeDatepicker = document.getElementById("datepicker").value;
var employeeBasicSalary = document.getElementById("luongCB").value;
var employeePosition = document.getElementById("chucvu").value;
var employeeWorkingHour = document.getElementById("gioLam").value;
var isValid = true;

isValid &= required(employeeId, "tbTKNV") && checkLength(employeeId, "tbTKNV",4,6);
isValid &= required(employeeName, "tbTen") && checkEmployeeName(employeeName, "tbTen");
isValid &= required(employeeEmail, "tbEmail") && checkEmail(employeeEmail, "tbEmail");
isValid &= required(employeePassword, "tbMatKhau") && checkLength(employeePassword, "tbMatKhau",6,10) && checkPassword(employeePassword, "tbMatKhau");
isValid &= required(employeeDatepicker, "tbNgay") && checkDate(employeeDatepicker, "tbNgay");
isValid &= required(employeeBasicSalary, "tbLuongCB") && checkSalary(employeeBasicSalary, "tbLuongCB");
isValid &= required(employeePosition, "tbChucVu");
isValid &= required(employeeWorkingHour, "tbGiolam") && checkHour(employeeWorkingHour, "tbGiolam");


return isValid;

}

function createEmployee(){
// validate d??? li???u
var isValid = validateForm();
if (!isValid) return;

//1 L???y th??ng tin ng?????i d??ng t??? input
var employeeId = document.getElementById("tknv").value;
var employeeName = document.getElementById("name").value;
var employeeEmail = document.getElementById("email").value;
var employeePassword = document.getElementById("password").value;
var employeeDatepicker = document.getElementById("datepicker").value;
var employeeBasicSalary = +document.getElementById("luongCB").value;
var employeePosition = document.getElementById("chucvu").value;
var employeeWorkingHour = +document.getElementById("gioLam").value;

for (var i = 0; i < employeeList.length; i++) {
  if (employeeList[i].account === employeeId) {
    alert("M?? nh??n vi??n tr??ng l???p!!");
    return;
  }
}


// 2. t???o ?????i t?????ng nh??n vi??n t??? th??ng tin ngdung nh???p

var employee = new Employee(
  employeeId,
  employeeName,
  employeeEmail,
  employeePassword,
  employeeDatepicker,
  employeeBasicSalary,
  employeePosition,
  employeeWorkingHour,
);

// 3. th??m nh??n vi??n m???i v??o danh s??ch
employeeList.push(employee);

// in danh s??ch sinh vi??n ra b???ng
renderEmployees();

// l??u ds sinh vi??n xu???ng local storage
saveData();
}

function renderEmployees(data) {
  if (!data) data = employeeList;

  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `
      <tr>
        <td>${data[i].account}</td>
        <td>${data[i].name}</td>
        <td>${data[i].email}</td>
        <td>${data[i].datePicker}</td>
        <td>${data[i].position}</td>
        <td>${data[i].calcTotalSalary()}</td>
        <td>${data[i].rank()}</td>
        <td>
            <button onclick="deleteEmployee('${
              data[i].account
            }')" class="btn btn-danger">Xo??</button>

            <button class="btn btn-info" id="btnThem" data-toggle="modal"
            data-target="#myModal" onclick="getEmployeeDetail('${
              data[i].account
            }')" class="btn btn-info">S???a</button>
        </td>
      </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}

function saveData() {
  // chuy???n t??? m???t m???ng object sang ?????nh d???ng JSON
  var employeeListJSON = JSON.stringify(employeeList);

  localStorage.setItem("SL", employeeListJSON);
}

function getData() {
  var employeeListJSON = localStorage.getItem("SL");

  if (!employeeListJSON) return;

  var employeeListLocal = JSON.parse(employeeListJSON);
  employeeList = mapData(employeeListLocal);

  renderEmployees();
}

// input: m???ng nh??n vi??n t??? local => ouput: m???ng nh??n vi??n m???i
function mapData(dataFromLocal) {
  var result = [];
  for (var i = 0; i < dataFromLocal.length; i++) {
    var oldEmployee = dataFromLocal[i];
    var newEmployee = new Employee(
      oldEmployee.account,
      oldEmployee.name,
      oldEmployee.email,
      oldEmployee.pass,
      oldEmployee.datePicker,
      oldEmployee.basicSalary,
      oldEmployee.position,
      oldEmployee.workingHour
    );
    result.push(newEmployee);
  }

  return result;
}


function deleteEmployee(account) {
  var index = findById(account);
  if (index === -1) {
    alert("Kh??ng t??m th???y id ph?? h???p.");
    return;
  }

  var aus = confirm("B???n c?? ch???c ch???n mu???n xo?? t??i kho???n \"" + account + "\" kh??ng?"); 
  if (aus == true){
    employeeList.splice(index, 1);
  };
  
  renderEmployees();
  saveData();
}

// input :id => output: index
function findById(id) {
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].account === id) {
      return i;
    }
  }
  return -1;
}

function searchEmployees() {
  var result = [];
  var keyword = document.getElementById("searchName").value;

  for (var i = 0; i < employeeList.length; i++) {
    var currentEmployeeRank = employeeList[i].ranking;
    var currentEmployName = employeeList[i].name;

    if (currentEmployeeRank.includes(keyword) || currentEmployName.includes(keyword)) {
      result.push(employeeList[i]);
    }
  }

  renderEmployees(result);
}

// update 1: ????a th??ng tin c???a sinh vi??n mu???n update l??n form
function getEmployeeDetail(account) {
  var index = findById(account);
  if (index === -1) {
    alert("Kh??ng t??m th???y m?? nh??n vi??n ph?? h???p.");
    return;
  }
  var employee = employeeList[index];

document.getElementById("tknv").value = employee.account;
document.getElementById("name").value = employee.name;
document.getElementById("email").value = employee.email;
document.getElementById("password").value = employee.pass;
document.getElementById("datepicker").value = employee.datePicker;
document.getElementById("luongCB").value = employee.basicSalary;
document.getElementById("chucvu").value = employee.position;
document.getElementById("gioLam").value = employee.workingHour;

document.getElementById("tknv").disabled = true;

document.getElementById("btnThemNV").style.display = "none";
document.getElementById("btnCapNhat").style.display = "block";

}

// update 2: cho ph??p ng?????i d??ng s???a tr??n form, ng?????i d??ng nh???n n??t l??u => c???p nh???t
function updateEmployee() {

// validate d??? li???u
var isValid = validateForm();
if (!isValid) return;

var employeeId = document.getElementById("tknv").value;
var employeeName = document.getElementById("name").value;
var employeeEmail = document.getElementById("email").value;
var employeePassword = document.getElementById("password").value;
var employeeDatepicker = document.getElementById("datepicker").value;
var employeeBasicSalary = +document.getElementById("luongCB").value;
var employeePosition = document.getElementById("chucvu").value;
var employeeWorkingHour = +document.getElementById("gioLam").value;

  var index = findById(employeeId);

  if (index === -1) {
    alert("Kh??ng t??m th???y m?? nh??n vi??n ph?? h???p!");
    return;
  }

  var employee = employeeList[index];

  employee.name = employeeName;
  employee.email = employeeEmail;
  employee.pass = employeePassword;
  employee.datePicker = employeeDatepicker;
  employee.basicSalary = employeeBasicSalary;
  employee.position = employeePosition;
  employee.workingHour = employeeWorkingHour;

  renderEmployees();

  saveData();

  document.getElementById("myform").reset();
  document.getElementById("tknv").disabled = false;

}

window.onload = function () {
  // code ??? trong n??y s??? ch???y khi ng?????i d??ng load trang
  console.log("window onload");
  getData();
};

// ------------ VALIDATE FUNCTIONS --------------------
// check required

function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).innerHTML = "*Vui l??ng kh??ng b??? tr???ng*";
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}

// check minlength - maxlength
function checkLength(value, spanId, min, max) {
  if (value.length < min || value.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*????? d??i ph???i t??? ${min} t???i ${max} k?? t???`;
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}

//pattern
//regular expression: bu???i th???c ch??nh quy

function checkEmployeeName(value, spanId) {
  var pattern = /[^a-z0-9A-Z_???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????]/u;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Vui l??ng nh???p ?????y ????? h??? v?? t??n (kh??ng nh???p s??? v?? k?? t??? ?????c bi???t).";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkEmail(value, spanId){
  var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Vui l??ng nh???p ????ng ?????nh d???ng email*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkPassword(value, spanId){
  var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*M???t kh???u ph???i bao g???m 1 ch??? vi???t IN HOA, 1 ch??? s??? v?? 1 k?? t??? ?????c bi???t*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkDate(value, spanId){
  var pattern = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*?????nh d???ng Ng??y/Th??ng/N??m kh??ng h???p l???*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkSalary(value, spanId) {
  if (value < 1000000 || value > 20000000) {
    document.getElementById(
      spanId
    ).innerHTML = `*Ti???n l????ng ph???i t??? 1000000 t???i 20000000*`;
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}

function checkHour(value, spanId) {
  if (value < 80 || value > 200) {
    document.getElementById(
      spanId
    ).innerHTML = `*Gi??? l??m ph???i t??? 80 t???i 200*`;
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}