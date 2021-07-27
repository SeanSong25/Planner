<template>
<div>
    <p class="headTitle" >{{Prop.Title}}</p>
    <el-table border :data="fieldData"
    @selection-change = "handleSelectionChange"
    :key="tableKey"
    >
        <el-table-column
            type="selection"
            width="30">
        </el-table-column>
        <el-table-column prop="Monday" label="Monday">
             <template  slot-scope="scope">
                <el-cascader 
                 :disabled="disabler"
                :key="cascaderKey+'1'"
                 :options="newoptions"
                 v-model="scope.row.Monday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template> 
        </el-table-column>
         <el-table-column prop="Tuesday" label="Tuesday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey+'2'"
                 :options="newoptions"
                 v-model="scope.row.Tuesday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Wednesday" label="Wednesday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey+'3'"
                 :options="newoptions"
                 v-model="scope.row.Wednesday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Thursday" label="Thursday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey+'4'"
                 :options="newoptions"
                 v-model="scope.row.Thursday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Friday" label="Friday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                 :options="newoptions"
                 :key="cascaderKey+'5'"
                 v-model="scope.row.Friday"
                 :show-all-levels="false"
                 placeholder="Select"
                >
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Saturday" label="Saturday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey+'6'"
                 :options="newoptions"
                 v-model="scope.row.Saturday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Sunday" label="Sunday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                 :options="newoptions"
                 :key="cascaderKey+'7'"
                 v-model="scope.row.Sunday"
                 :show-all-levels="false"
                 placeholder="Select"
                 >
                </el-cascader>
            </template>
        </el-table-column>
    </el-table>
    <div style="float:right">
        <el-button type="primary" style="margin-top:15px" @click="addRow">
            <i class="el-icon-plus"></i>
        </el-button>
        <el-button type="primary" style="margin-top:15px" @click="deleteRow">
            <i class="el-icon-minus"></i>
        </el-button>
        <el-button type="primary" style="margin-top:15px" @click="checked">
            <i class="el-icon-check" ></i>
        </el-button>
        <el-button type="primary" style="margin-top:15px"  @click="toEdit">
            <i class="el-icon-edit"></i>
        </el-button>
    </div>
</div>
</template>

<script>
import axios from "axios"
const unfilledURL = "http://192.168.124.12:3003/fixedFormTable"
//const unfilledURL = "http://192.168.2.12:3003/fixedFormTable"
const toFillURL = "http://192.168.124.12:3003/fixedFormTable/filler"
//const toFillURL = "http://192.168.2.12:3003/fixedFormTable/filler"
const updateURL = "http://192.168.124.12:3003/fixedTableUpdate"
//const updateURL = "http://192.168.2.12:3003/fixedTableUpdate"
const fixedTableDataURL = "http://192.168.124.12:3003/fixedFormTable/tableData"
//const fixedTableDataURL = "http://192.168.2.12:3003/fixedFormTable/tableData"
const fixedTableDataDelete = "http://192.168.124.12:3003/fixedFormTable/DeleteData"
//const fixedTableDataDelete = "http://192.168.2.12:3003/fixedFormTable/DeleteData"
export default {
    
    props:{
        Prop:{Title:"", Id:''},
    },
    name:"FixedFormTable",
    data(){
        return{
            disabler:true,
            cascaderKey:'1',
            fieldData:[],
            standardCol:{
                index:'',
                Monday: [],
                Tuesday:[],
                Wednesday:[],
                Thursday:[],
                Friday:[],
                Saturday:[],
                Sunday: []
            },
            newoptions:[],
            multipleSelection:[],
            tableKey:'hello'
        }
    },
    async created(){
        
        let res = await axios.get(unfilledURL+'/'+this.Prop.Id);
        this.newoptions = res.data
        let postRes = await axios.post(toFillURL,res.data);
        this.newoptions = [...postRes.data];
        this.cascaderKey = Date.now();
        let dataRes = await axios.get(fixedTableDataURL+'/'+this.Prop.Title)
        this.fieldData = dataRes.data;
        
    },
    watch:{
        
    },
    methods:{
        
        addRow(){
            var newObj = {...this.standardCol};
            
            if(this.fieldData.length>0){
                newObj.index = this.fieldData[this.fieldData.length-1].index+1;
            }else{
                newObj.index = 1;
            }
            this.fieldData.push(newObj);
            
        },
        deleteRow(){
        this.$confirm('此操作将永久删除该行, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            if(this.multipleSelection.length==0)
            {
                this.$message({type:'info',
                message:'Select at least one option'})
            }
            else{
                    let indexArr = [];
                    
                    for(let item of this.multipleSelection){
                        indexArr.push(item.index);
                    }
                    
                    axios.post(fixedTableDataDelete, {Title: this.Prop.Title, indexArr:indexArr}).then(()=>{
                       for(let i of indexArr){
                           this.fieldData.splice(this.fieldData.findIndex(d=>d.index===i),1);
                       }
                       this.tableKey = Date.now();
                    })
                }
                
                 this.$message({
                        type: 'success',
                        message: 'Deletion Succeeded!'
                })
            }
        ).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancelled'
          });          
        });
            
        },  

        handleSelectionChange(val) {
        this.multipleSelection = val;
      },

        checked(){
            this.disabler = true;
            let data = {
                fieldData:this.fieldData,
                Title: this.Prop.Title,
                id:this.Prop.Id
            }
            
            axios.post(updateURL, data);
        },
        toEdit(){
            this.disabler = false;
        },
        compareIndex(a, b){
            if(a.index<b.index){
                return -1;
            }
            else if(a.index>b.index){
                return 1;
            }
            return 0;
        },


    }
}
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css2?family=Crimson+Pro&family=Literata&family=Odibee+Sans);
.headTitle{
    width:100%;
    font-family:'Odibee Sans', Arial;
    font-size:24px;
    text-align: center;
}
</style>