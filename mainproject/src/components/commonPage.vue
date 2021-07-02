<template>
    <el-container style="height: 1000px; border: 1px solid #eee;">
        <el-aside width="250px" style="background-color: rgb(238, 241, 246); margin-right:20px">
            <updateTree @isPlan="planAdd" @added="addTable" @node-is-clicked="showNodeTable" 
            @childDeleted="deleteChild" @planDeleted="deletePlan" ></updateTree>
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

export default {
    name:"commonPage",
    components:{updateTree, updateFormTable, FixedFormTable},
    data(){
        return{
            numTable:0,
            tableInfo:[],
            planTableInfo:[],
            Id:'',
            refreshId:'',
            isPlan:false,
            subOptArray:[],
            Options:[],
            notPlan:false,
        }
    },
    watch:{

    },
    created(){

    },
    methods:{
        addTable(Obj){
            this.numTable+=1;
            var title = JSON.parse(JSON.stringify(Obj.label));
            var id = JSON.parse(JSON.stringify(Obj.id));
            this.Id=id;
            var newObj={Title:title, Id:id};
            if(!this.isPlan)
            {
                this.tableInfo.push(newObj);
            }
            else{
                this.planTableInfo.push(newObj);
                this.isPlan = false;
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
            var newObj={
                value:[],
                Id : "",
            }
            if(Obj.length>0){
                newObj.value = Obj;
                newObj.Id = Id;
            }
            var a = 0;
            if((a = this.subOptArray.findIndex(d=>d.Id===newObj.Id)) !=-1){
                this.subOptArray[a]={...newObj};
            }
            else
                this.subOptArray.push(newObj);
            
        }
        
    },
    computed:{

    }
}
</script>

<style scoped>

</style>