<template>
<div>
    <p class="headTitle" >{{Prop.Title}}</p>
    <el-table border :data="fieldData"
    @selection-change = "handleSelectionChange"
    >
        <el-table-column
            type="selection"
            width="30">
        </el-table-column>
        <el-table-column prop="Monday" label="Monday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey"
                 :options="options"
                 v-model="scope.row.Monday">
                </el-cascader>
            </template> 
        </el-table-column>
         <el-table-column prop="Tuesday" label="Tuesday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey"
                 :options="options"
                 v-model="scope.row.Tuesday">
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Wednesday" label="Wednesday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey"
                 :options="options"
                 v-model="scope.row.Wednesday">
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Thursday" label="Thursday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey"
                 :options="options"
                 v-model="scope.row.Thursday">
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Friday" label="Friday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                 :options="options"
                 :key="cascaderKey"
                 v-model="scope.row.Friday">
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Saturday" label="Saturday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                :key="cascaderKey"
                 :options="options"
                 v-model="scope.row.Saturday">
                </el-cascader>
            </template>
        </el-table-column>
         <el-table-column prop="Sunday" label="Sunday">
             <template slot-scope="scope" >
                <el-cascader :disabled="disabler"
                 :options="options"
                 :key="cascaderKey"
                 v-model="scope.row.Sunday">
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
export default {
    
    props:{
        Prop:{Title:"", Id:''},
        SelectOptions:{
            type:Array,
            default: () => {
                return []
                }
            }
        },
    name:"FixedFormTable",
    data(){
        return{
            disabler:true,
            cascaderKey:'1',
            fieldData:[],
            standardCol:{
                index:'',
                Monday: '',
                Tuesday:'',
                Wednesday:'',
                Thursday:'',
                Friday:'',
                Saturday:'',
                Sunday: ''
            },
            options:[],
            multipleSelection:[],
        }
    },
    created(){
        this.cascaderKey = Date.now();
        console.log("ss", this.SelectOptions)
    },
    watch:{
        SelectOptions(){
            this.cascaderKey = Date.now();
            this.options = this.SelectOptions;
            console.log("select options", this.SelectOptions)
        }
    },
    methods:{
        addRow(){
            var newObj = {...this.standardCol};
            newObj.index = this.fieldData.length;
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
                message:'请选择至少一个删除对象'})
            }
            else{
                this.multipleSelection.sort((a,b)=>a.index-b.index);
                var ind = this.multipleSelection[0].index;
                
                var cnt = 1;
                var tempCnt = 0;
                var tempInd = ind;
                for(let item of this.multipleSelection){
                    if(item.index==tempInd+1){cnt++; tempInd++;}
                    else if(item.index-tempInd>1){
                        this.fieldData.splice(ind,cnt);
                        tempCnt+=cnt;
                        ind = item.index-tempCnt;
                        tempInd = ind;
                        cnt = 1;
                    }
                }
                this.fieldData.splice(ind,cnt);
                for(var i = 0; i<this.fieldData.length; i++){
                    this.fieldData[i].index = i;
                }
                 this.$message({
                        type: 'success',
                        message: '删除成功!'
                })
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
            
        },

        handleSelectionChange(val) {
        this.multipleSelection = val;
      },

        checked(){
            this.disabler = true;
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