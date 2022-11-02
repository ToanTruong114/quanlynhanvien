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
// validate dữ liệu
var isValid = validateForm();
if (!isValid) return;

//1 Lấy thông tin người dùng từ input
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
    alert("Mã nhân viên trùng lặp!!");
    return;
  }
}


// 2. tạo đối tượng nhân viên từ thông tin ngdung nhập

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

// 3. thêm nhân viên mới vào danh sách
employeeList.push(employee);

// in danh sách sinh viên ra bảng
renderEmployees();

// lưu ds sinh viên xuống local storage
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
            }')" class="btn btn-danger">Xoá</button>

            <button class="btn btn-info" id="btnThem" data-toggle="modal"
            data-target="#myModal" onclick="getEmployeeDetail('${
              data[i].account
            }')" class="btn btn-info">Sửa</button>
        </td>
      </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}

function saveData() {
  // chuyển từ một mảng object sang định dạng JSON
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

// input: mảng nhân viên từ local => ouput: mảng nhân viên mới
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
    alert("Không tìm thấy id phù hợp.");
    return;
  }

  var aus = confirm("Bạn có chắc chắn muốn xoá tài khoản \"" + account + "\" không?"); 
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

// update 1: đưa thông tin của sinh viên muốn update lên form
function getEmployeeDetail(account) {
  var index = findById(account);
  if (index === -1) {
    alert("Không tìm thấy mã nhân viên phù hợp.");
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

// update 2: cho phép người dùng sửa trên form, người dùng nhấn nút lưu => cập nhật
function updateEmployee() {

// validate dữ liệu
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
    alert("Không tìm thấy mã nhân viên phù hợp!");
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
  // code ở trong này sẽ chạy khi người dùng load trang
  console.log("window onload");
  getData();
};

// ------------ VALIDATE FUNCTIONS --------------------
// check required

function required(value, spanId) {
  if (value.length === 0) {
    document.getElementById(spanId).innerHTML = "*Vui lòng không bỏ trống*";
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
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}

//pattern
//regular expression: buổi thức chính quy

function checkEmployeeName(value, spanId) {
  var pattern = /[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Vui lòng nhập đầy đủ họ và tên (không nhập số và ký tự đặc biệt).";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkEmail(value, spanId){
  var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Vui lòng nhập đúng định dạng email*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkPassword(value, spanId){
  var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Mật khẩu phải bao gồm 1 chữ viết IN HOA, 1 chữ số và 1 ký tự đặc biệt*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkDate(value, spanId){
  var pattern = /^(((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))[-/]?[0-9]{4}|02[-/]?29[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML = "*Định dạng Ngày/Tháng/Năm không hợp lệ*";
  document.getElementById(spanId).style.display = "block";
  return false;
}

function checkSalary(value, spanId) {
  if (value < 1000000 || value > 20000000) {
    document.getElementById(
      spanId
    ).innerHTML = `*Tiền lương phải từ 1000000 tới 20000000*`;
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
    ).innerHTML = `*Giờ làm phải từ 80 tới 200*`;
    document.getElementById(spanId).style.display = "block";
    return false;
  }

  document.getElementById(spanId).style.display = "none";
  return true;
}