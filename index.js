const input = document.querySelector('input[type="file"]');

input.addEventListener('change',
 function (e){

    //Employee object schema
    var Employee = {
        "employeeID" : 0, get getEmployeeId(){
            return this.employeeID;
        },
        "projects" : [], get getProjects(){
            return this.projects;
        },
        "employeesWorkedWith" : new Map(), get getEmployeesWorkedWith(){
            return this.employeesWorkedWith;
        }
    };

    //Project object schema
    var Project = {

        "projectID" : 0, get getProjectID(){
            return this.projectID;
        },

        "dateFrom" : '', get getDateFrom(){
            return this.dateFrom;
        },

        "dateTo" : '', get getDateTo(){
            return this.dateTo;
        } 
    };
    
    const reader = new FileReader();
    reader.onload = function(){
        const lines = reader.result.split('\n').map(function (line){
            return line.split(',')
        })

        //array of employees with their projects
        var globalArray = [];
        var maxDaysTogether = 0;

      for(var row = 0; row < lines.length; row++){

        var employee = Object.create(Employee);
        var project = Object.create(Project);

        for(var col = 0; col < lines[row].length; col++){

            switch(col){

                case 0:
                employee.employeeID = lines[row][col];
                employee.projects = [];
                employee.employeesWorkedWith = new Map();
                break;

                case 1:
                project.projectID = lines[row][col];
                break;

                case 2:
                project.dateFrom = lines[row][col];
                break;

                case 3:
                project.dateTo = lines[row][col];
                break
            }
        }
        //executes only one time-first time to fill the array with an object
        if(globalArray.length==0){
            globalArray.push(employee);
            globalArray[0].getProjects.push(project);
        }
        else {
            var index = 0;
            var flag = false;

            for(var indexOfEmployee = 0; indexOfEmployee < globalArray.length; indexOfEmployee++){
                //check if we already have that employee 
                if(employee.getEmployeeId == globalArray[indexOfEmployee].getEmployeeId){
                    index = indexOfEmployee;
                    flag = true;
                }
            }
                //if we have the employee - give us the dates and projects he/she worked on
            if(flag){
                globalArray[index].getProjects.push(project);
            }
            else {
                //if we dont have the employee - add it to the array with other employees with its projects
                globalArray.push(employee);
                globalArray[globalArray.length-1].getProjects.push(project);
            }
        }
      }
      
      for(var i = 0; i < globalArray.length; i++){
          
          for(var z = i+1; z < globalArray.length-1; z++){
            var totalCommonWorkingDays = 0;
             
            for(var x = 0; x < globalArray[i].getProjects.length; x++){
            
                for(var y = 0; y < globalArray[z].getProjects.length; y++){
                    //if two employees worked on the same project
                    if(globalArray[i].getProjects[x].getProjectID == globalArray[z].getProjects[y].getProjectID){
                
                        var commonWorkingDays = 0;

                        /*function to calculate amount of days of two employees
                            who worked on common project at the same time*/
                    function getDiffDays(firstDate1,  secondDate2){
                        var oneDay = 24*60*60*1000; // one day
                        firstDate = new Date(firstDate1);
                        secondDate = new Date(secondDate2);
                        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                   return diffDays;
                    };
                
                var DF1 = globalArray[i].getProjects[x].getDateFrom //DF1
                var DF2 = globalArray[z].getProjects[y].getDateFrom //DF2
                var DT1 = globalArray[i].getProjects[x].getDateTo //DT1
                var DT2 = globalArray[z].getProjects[y].getDateTo //DT2
                
                    //chek if they work on that project at common period
                if(DF1 >= DF2 && DT2 <= DT1){
                    commonWorkingDays = getDiffDays(DT2, DF1);
                }else if(DF1 >= DF2 && DT2 >= DT1){
                    commonWorkingDays = getDiffDays(DT1, DF1);
                }else if(DF1 <= DF2 && DT1 <= DT1){
                    commonWorkingDays = getDiffDays(DT2, DF2);
                }else if(DF1 <= DF2 && DT2 >= DT1){
                    commonWorkingDays = getDiffDays(DT1, DF2);
                }
                //sum the common days of two employees over different projects
                totalCommonWorkingDays += commonWorkingDays;
                    }
                }
            }
            //fill the map
        globalArray[i].getEmployeesWorkedWith.set(globalArray[z].getEmployeeId, totalCommonWorkingDays);
            //get values of the maps and sort them
       var arrayOfValues = [...globalArray[i].getEmployeesWorkedWith.values()];
       arrayOfValues.sort(function(a, b){
           return (b-a)
       });
            //find longest period of working days for an employee
       if(arrayOfValues[0] > maxDaysTogether){
           maxDaysTogether = arrayOfValues[0];
           var myID = globalArray[i].getEmployeeId;
       }
            //find his/hers partner
       for(const k of globalArray[i].getEmployeesWorkedWith.keys()){
           if(globalArray[i].getEmployeesWorkedWith.get(k) == maxDaysTogether){
               var partnerID = k;
           }
        }

        }
        //log out the duo with the most working days over common projects
      console.log("Employee1 ID : "+myID+ " Employee2 ID : "+partnerID + " Total days : " + maxDaysTogether);
    }
        //for easy checking in (browser) dev tools
      console.log(globalArray);

  }
    reader.readAsText(input.files[0]);
}, false);
