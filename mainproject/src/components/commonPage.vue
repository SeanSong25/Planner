<template>
    <el-container style="height: 1000px; border: 1px solid #eee;">
        <el-aside width="250px" style="background-color: rgb(238, 241, 246); margin-right:20px">
            <updateTree @isPlan="planAdd" @added="addTable" @node-is-clicked="showNodeTable" 
            @childDeleted="deleteChild" @planDeleted="deletePlan" :treeData="treeData" ></updateTree>
        </el-aside>
        <el-main style="background-color: rgb(238,241,240);">
            <updateFormTable v-for="tableData in tableInfo" :key="tableData.Id" :tableProp="tableData" 
            v-show="Id==tableData.Id" @dataConfirmed="pushNewData"></updateFormTable>
            <FixedFormTable v-for="planData in planTableInfo" 
            :key="planData.Id" :Prop="planData" 
            v-show="Id==planData.Id" :SelectOptions="Options" ></FixedFormTable>
        </el-main>
    </el-container>
</template>

<script>
import updateTree from "./customTree.vue";
import updateFormTable from "./updateFormTable.vue";
import FixedFormTable from "./fixedFormTable.vue";
import axios from "axios";
const treeDataURL = "http://192.168.124.85:3003/tree/Data";
//const treeDataURL = "http://192.168.2.12:3003/tree/Data";
const formtableCreateURL = "http://192.168.124.85:3003/formtableCreate";
//const formtableCreateURL = "http://192.168.2.12:3003/formtableCreate";
const fixedtableCreateURL = "http://192.168.124.85:3003/fixedtableCreate";
//const fixedtableCreateURL = "http://192.168.2.12:3003/fixedtableCreate";
export default {
    name:"commonPage",
    components:{updateTree, updateFormTable, FixedFormTable},
    data(){
        return{
            numTable:0,
            tableInfo:[],
            planTableInfo:[],
            Id:'',
            isPlan:false,
            subOptArray:[],
            Options:[],
            treeData:[],
        }
    },
    watch:{

    },
    async created(){
        let res = await axios.get(treeDataURL)
        this.treeData = res.data;

        for(let item of this.treeData){
            if(item.Pid!=0&&item.Pid!=1){
                this.tableInfo.push({Title: item.Name, Id:item.id})
            }else{
                this.planTableInfo.push({Title: item.Name, Id: item.id})
            }
        }
        console.log("tableInfo", this.tableInfo);
        console.log("planTableInfo", this.planTableInfo)
    },
    methods:{
        addTable(Obj){
            this.numTable+=1;
            let title = JSON.parse(JSON.stringify(Obj.label));
            let id = JSON.parse(JSON.stringify(Obj.id));
            this.Id=id;
            let newObj={Title:title, Id:id};
            if(!this.isPlan)
            {
                this.tableInfo.push(newObj); //非fixed表格添加
                axios.post(formtableCreateURL,newObj);
            }
            else{
                this.planTableInfo.push(newObj);//fixed表格添加
                this.isPlan = false;
                axios.post(fixedtableCreateURL, newObj);
            }
            
        },
        showNodeTable(data){
            this.Id = data.id;
            if(data.children.length>0){
              var newObj=[];
            for(let item of data.children){
               
                var tempObj = {
                    value:item.label,
                    label:item.label,
                    key:item.id,
                    children:[],
                }
                if(this.subOptArray.length>0){
                    tempObj.children=this.subOptArray;
                    [this.subOptArray.findIndex((a)=>a.Id===item.id)].value}
                
                newObj.push(tempObj);
                
            }

            this.Options=newObj;
            
            }
            
        },
        deleteChild(index){
            
            var ind = this.tableInfo.findIndex(d=>d.id===index);
            this.tableInfo.splice(ind,1);
            this.Options.splice(this.Options.findIndex((a)=>a.key===index), 1);
            this.numTable--;

        },

        deletePlan(index){
            var ind = this.planTableInfo.findIndex(d=>d.id===index);
            this.planTableInfo.splice(ind,1);
            this.numTable--;
        },
        
        planAdd(){
            this.isPlan = true;
        },
        pushNewData(Obj, Id){
           
            if(Obj.length>0){
                for(let item of Obj){
                item.id = Id;
                item.children=[]
            }
            }   
            var a = 0;
            if(Obj.length>0&&(a = this.subOptArray.findIndex(d=>d.Id===Obj[0].Id)) !=-1){
                this.subOptArray[a]={...Obj};
            }
            else
                this.subOptArray.push(Obj);
            
        }
        
    },
    computed:{

    }
}
</script>

<style scoped>

</style>