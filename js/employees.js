function Employee(account, name, email, pass, datePicker, basicSalary, position, workingHour){
 this.account = account;
 this.name = name;
 this.email = email;
 this.pass = pass;
 this.datePicker = datePicker;
 this.basicSalary = basicSalary;
 this.position = position;
 this.workingHour = workingHour;
 this.totalSalary = 0;
 this.ranking = "";

this.calcTotalSalary = function(){
    if (this.position === "Sếp"){     
        return this.totalSalary = this.basicSalary*3;;
    }if (this.position === "Trưởng phòng"){       
        return this.totalSalary = this.basicSalary*2;;
    }if (this.position === "Nhân viên"){
        return this.totalSalary = this.basicSalary*1;;
    }
}

this.rank = function() {
    if (this.position == "Nhân viên"){
        if (this.workingHour >= 192){
        return this.ranking = "Xuất sắc";
        }
        if (this.workingHour >= 176){
        return this.ranking = "Giỏi";
        }
        if (this.workingHour >= 160){
        return this.ranking = "Khá";
        }
        if (this.workingHour < 160){
            return this.ranking = "Trung Bình";
        }      
    }
    else {
        return this.ranking = "";
    }
};

}