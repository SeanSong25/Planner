<template>
    <div ref="Global">

                <el-col :span="4" style="margin-left:20px; margin-top:32px">
                    <el-input style="margin-bottom:20px; " v-if="!addFlag" v-model="tempTitle" :disabled="addFlag"></el-input>
                     <el-input style="margin-bottom:20px" v-else-if="deleteEnable " v-model="deleteTitle" :disabled="!deleteEnable"></el-input>
                    <el-row>
                        <el-button type="primary"  class="buttonOne" round  @click="onAdd" :disabled="!titleFlag">添加列</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="addConfirm" :disabled="addFlag">确定列</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="editEnabler" >修改/添加</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="editConfirm" :disabled="!edittable ">修改完成</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="deleteCol ">删除列</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="confirmCol" :disabled="!deleteEnable">确认删除</el-button>
                    </el-row>
                    <el-row>
                        <el-button type="primary" class="buttonOne" round @click="cancelOption" >取消</el-button>
                    </el-row>
                </el-col>
                <el-col style="float:right" :span="19">

                    <el-row>
                        <p class="headTitle" >{{tableProp.Title}}</p>
                        <el-table border :data="fieldData" style="width: 100%" class="tableClass" :key="tableKey">
                            <el-table-column v-for="name in propName"
                            :key="name.key"
                            :label="name.title"
                            align="center"
                            :prop="name.title"
                            >
                            <template slot-scope="scope" >
                                 <el-input :disabled="!edittable" v-model="scope.row[name.title]" 
                                 size="small" controls-position="right"></el-input>
                             </template>              
                            </el-table-column>
                            <el-table-column>
                                <template slot-scope="scope">
                                    <el-button style="width:100%"
                                    type="danger"
                                    :disabled="!edittable"
                                    @click="handleDelete(scope.$index, scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>
                    <el-row>
                        <el-form :model="tempData" :key="formKey">
                            <el-form-item v-for="name in tempData.data"
                            :key="name.key"
                            :label="name.title">
                                
                                <el-input v-model="name.value" :disabled="!edittable"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="submitForm" :disabled="!edittable ">Submit</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </el-col>
                
    </div>
</template>

<script>
import axios from "axios";
const baseURL = "http://192.168.124.85:3003/formTable/1/Data"
//const baseURL = "http://192.168.2.12:3003/formTable/1/Data"
const nameURL = "http://192.168.124.85:3003/formTable/1/nameData"//
//const nameURL = "http://192.168.2.12:3003/formTable/1/nameData"
const tempURL = "http://192.168.124.85:3003/formTable/1/tempData"

//const tempURL = "http://192.168.2.12:3003/formTable/1/tempData"
export default {
    name:"updateFormTable",
    
    props:{
        tableProp:{
            Title:'',
            Id:'',
        }
    },
    data(){
        return{
            tableKey:"kkk",
            formKey:"helloWorld",
            title:[],
            propName:[
            ],
            fieldData:[
            ],
            
            tempData:{
                data:[],
            },
            tempTitle:'',
            addFlag:true,
            columnCount:0,
            tableTitle:"Table",
            titleFlag : true,
            edittable :false,
            deleteTitle:'',
            deleteEnable:false,
           
        }
    },
    async created(){
        
        const res = await axios.get(baseURL)
        console.log(res.data)
        this.fieldData=res.data;
        const resp = await axios.get(nameURL)
        console.log(resp.data)
        this.propName = resp.data;
        const respo = await axios.get(tempURL)
        this.tempData.data=respo.data;
        this.sendOptions();
    },
    methods:{
        onAdd(){
            this.addFlag = false;
            },
        
        addConfirm(){
                if(this.tempTitle!=''){
                var newObj = {
                    title:this.tempTitle,
                    key:this.columnCount,
                }
                var tempObj ={
                    title:this.tempTitle,
                    key:this.columnCount,
                    value:''
                }
                //let lastColName = this.propName[this.propName.length-1].title;
                this.columnCount++;
                this.tempTitle='';
                /*let sendObj = {
                    title:this.tempTitle,
                    key:this.columnCount,
                    colName:lastColName
                }*/
                this.propName.push(newObj)
                axios.post(nameURL, newObj)
                this.formKey=Date.now();
                this.tempData.data.push(tempObj)
                this.addFlag = true;

        }
        },
        submitForm(){
            //var newTemp = JSON.parse(JSON.stringify(this.tempData.data));
            let newTemp = {}
            newTemp['id'] = this.fieldData.length+1; //给单条form数据加上id 字段
            var notNull = true;
            for(let data of this.tempData.data){
                newTemp[data.title] = data.value
                if(data.value=='') notNull=false;
            }
            
            if(notNull){
                this.fieldData.push(newTemp);
                this.tableKey = Date.now();
                axios.post(baseURL,newTemp);
            }
            
            
            for(var i = 0; i<this.tempData.data.length; i++)
            {
                this.tempData.data[i].value='';
            }
            this.formKey=Date.now();

        },
        addTitle(){
            this.titleFlag = false;
        },
        
        editEnabler(){
            this.edittable = true;
        },
        handleDelete(index){
        this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let Obj = {ColNum:this.fieldData[index].id};
            axios.post(baseURL+"Delete",Obj);
            this.tableKey=Date.now();
            this.fieldData.splice(index,1);
            
            this.$message({
                type:'success',
                message: '删除成功'
            })
        }).catch(()=>{
            this.$message({
            type: 'info',
            message: '已取消删除'
          });        
        })
        },
        deleteCol(){
            this.deleteEnable = true;
        },
        confirmCol(){
            for(let data of this.fieldData)
            {
                if(this.deleteTitle!="Title")
                delete data[this.deleteTitle];
            }
            var cnt = 0;
            for(let data of this.propName)
            {
                
                if(data.title==this.deleteTitle&&this.deleteTitle!="Title")
                {
                    this.propName.splice(cnt,1);
                    this.tempData.data.splice(cnt,1);
                    axios.post(nameURL+"/delete", {title:this.deleteTitle});
                }
                cnt++;
            }
            this.deleteEnable = false;
            this.tableKey = Date.now();
            
        },
        sendOptions(){
            let Obj = [];
            for(let data of this.fieldData){
                console.log(data)
                var newObj={};
                //axios.put(baseURL+'/'+data.id,data).catch(e=>console.log(e));
                newObj.value=data["Title"];
                newObj.label=data["Title"];
                
                Obj.push(newObj);
                
            }
            console.log(this.tableProp.Id)
            this.$emit("dataConfirmed",Obj, this.tableProp.Id);
        },
        editConfirm(){
            this.edittable = false;
            this.tableKey=Date.now();
            axios.post(baseURL+"/allData", this.fieldData);
            this.sendOptions();
        },
        cancelOption(){
            
            this.tempTitle = '';
            this.deleteTitle = '';
            this.addFlag = true;
            this.deleteEnable = false;
            this.edittable = false;

        },
        
    },
}
</script>

<style>
@import url(https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata&family=Odibee+Sans);
.headTitle{
    width:100%;
    font-family:'Odibee Sans', Arial;
    font-size:24px;
    text-align: center;
}
.buttonOne{
    display:block;
    width:100%;
    font-size:3px;
    text-align:center;
    margin-top:10px ! important;
    margin-bottom:10px ! important;
}
.tableClass{
        margin-top : 5px;
        margin-bottom: 20px;
        text-align: center;
}
.el-input input{text-align:center;
outline:none;}

.el-cascader {
  width: 100%;
}
</style>