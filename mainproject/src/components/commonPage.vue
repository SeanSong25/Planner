<template>
    <el-container style="height: 1000px; border: 1px solid #eee;">
        <el-aside width="250px" style="background-color: rgb(238, 241, 246); margin-right:20px">
            <updateTree @isPlan="planAdd" @added="addTable" @node-is-clicked="showNodeTable" 
            @childDeleted="deleteChild" @planDeleted="deletePlan" :treeData="treeData" ></updateTree>
        </el-aside>
        <el-main style="background-color: rgb(238,241,240);">
            <template v-for="tableData in tableInfo">
            <updateFormTable  :key="tableData.Id" :tableProp="tableData" 
            v-if="Id==tableData.Id" ></updateFormTable>
            </template>
            <template v-for="planData in planTableInfo">
                <FixedFormTable
                :key="planData.Id" :Prop="planData" 
                v-if="Id==planData.Id" ></FixedFormTable>
            </template>
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
            treeData:[],
            updater : false,
           
        }
    },
    watch:{

    },
    async created(){
        let res = await axios.get(treeDataURL)
        this.treeData = res.data;

        for(let item of this.treeData){
            if(item.Pid!=0&&item.Pid!=1){
                this.tableInfo.push({Title: item.Name, Id:item.id, Pid: item.Pid})
            }else if(item.Pid!=0){
                this.planTableInfo.push({Title: item.Name, Id: item.id})
            }
        }

    },
    methods:{
        async addTable(Obj){
            this.numTable+=1;
            let title = JSON.parse(JSON.stringify(Obj.label));
            let id = JSON.parse(JSON.stringify(Obj.id));
            let Pid = Obj.Pid
            this.Id=id;
            let newObj={Title:title, Id:id, Pid: Pid};
            if(!this.isPlan)
            {
                 //非fixed表格添加
                axios.post(formtableCreateURL,newObj).then(
                ()=>{
                    this.tableInfo.push(newObj)
                }       
                ).catch((e)=>{
                    console.log(e)
                })
                
            }
            else{
                //fixed表格添加
                this.isPlan = false;
                axios.post(fixedtableCreateURL, newObj).then(
                    this.planTableInfo.push(newObj)
                ).catch((e)=>{
                    console.log(e)
                });
            }
            
        },
        showNodeTable(data){
            this.Id = data.id;  
        },
        deleteChild(index){
            
            var ind = this.tableInfo.findIndex(d=>d.id===index);
            this.tableInfo.splice(ind,1);
            //this.Options.splice(this.Options.findIndex((a)=>a.key===index), 1);
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
        
    },
    computed:{

    }
}
</script>

<style scoped>

</style>