<template>
<div class="custom-tree-container">
  <div class="block">
     <el-row :gutter="20" style="margin-top:10px; margin-bottom:10px">
            <el-col :span="24">
                <el-input v-model="queryString"></el-input>
            </el-col>
      </el-row>
    <el-tree
      ref="tree"
      :data="data"
      node-key="id"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      @node-click="clickNode">
      
      <span class="custom-tree-node" slot-scope="{ node, data }" >
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :disabled = "data.isLeaf"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            :disabled="data.id==1"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
      
    </el-tree>
    <div>
        <el-col>
            <el-input v-model="tempTitle" :disabled="!showInput" v-show="showInput"></el-input>
            <el-button type="primary" style="text-align:center; display:block; width:100%" 
            @click="submitted" :disabled="!showInput" v-show="showInput">submit</el-button>
            <el-button type="danger" style="text-align:center; margin:0; display:block; width:100%" 
            @click="withdrawSubmission" :disabled="!showInput" v-show="showInput">取消</el-button>
        </el-col>
    </div>
  </div>
</div>
</template>

<script>
  
const treeDataURL = "http://192.168.124.85:3003/tree/Data";
//const treeDataURL = "http://192.168.2.12:3003/tree/Data";
//const refreshURL = "http://192.168.124.85:3003/refresh";
//const refreshURL = "http://192.168.2.12:3003/refresh";
import axios from "axios";
  export default {
    name:"updateTree",
    props:{
    },
    data() {
      return {
        queryString:"",
        notSure:false,
        showInput:false,
        onSubmit:false,
        treeData:[],
        lastId:-1,
        data:[],
        tempData:{},
        tempTitle:'',
      }
    },
    async beforeCreate(){
      //await axios.get(refreshURL);
    },
    async created(){
      let res = await axios.get(treeDataURL)
      this.treeData = res.data;
      //将数据库中的字段对应到组件
      let len = Object.keys(this.treeData).length;
      let max = 0;
      for(let i = 0; i<len; i++){
        if(this.treeData[i].id>max)
        {
          max = this.treeData[i].id;
        }
      }
      this.lastId = max;
      let root = {
        Pid: 0,
        id: 1,
        label: '我的计划',
        isLeaf: false,
        children:[]
      }
      
      for(let i = 1; i<len; i++){
        
        let temp = this.treeData[i]; 
        let Node = {};
        if(temp.Pid == '1'){
          Node.isLeaf = false;
          Node.children = [];
          Node.Pid = temp.Pid;
          Node.id = temp.id;
          Node.label = temp.Name;
          root.children.push(Node);
        }//fixed表单添加
        else{
          Node.isLeaf = true;
          Node.children = [];
          Node.Pid = temp.Pid;
          Node.id = temp.id;
          Node.label = temp.Name;
          for(let item of root.children){
            if(item.id == temp.Pid){
              item.children.push(Node);
              
              break;//update表单添加
            }
          }
        }
      }
      this.data.push(root);
    },
    methods: {
      filterNode(value,data){
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      append(data) {
        this.showInput = true; 
        this.tempData = data;   
        if(data.id ==1){
          this.$emit("isPlan");
        }
      },

      remove(node, data) {
        this.$confirm('This will permanently delete the node. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          const parent = node.parent;
          const children = parent.data.children;
          const index = children.findIndex(d => d.id === data.id);
          console.log(children)
          let names = [];
          let Obj = [];//array of children indexes to be deleted
          if(children[index].children.length>0){
            for(let item of children[index].children){
              Obj.push(item.id);
              names.push(item.label);
            }
          }
          axios.post(treeDataURL+"/delete",{id:children[index].id, children_Id: Obj, children_names:names,
          fixedName:children[index].label});
          children.splice(index, 1);
          if(parent.data.id!=1)
          {this.$emit("childDeleted", index);}
          else{this.$emit("planDeleted",index);}
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
        }).catch((err) => {
          console.log(err);
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });          
        });
        
      },


      submitted(){
          this.onSubmit = true;
      },
      
      clickNode(data){
        
        this.$emit("node-is-clicked", data);
        
      },

      withdrawSubmission(){
        this.showInput = false;
        this.onSubmit=false;
      }
      
    },
    watch:{
        onSubmit(){
            if(this.onSubmit)
                {var tempLabel = this.tempTitle;
                let Obj;
                if(this.tempData.id!=1){
                  let newChild = { id: ++this.lastId, Pid:this.tempData.id,
                  label: tempLabel, children: [], isLeaf:true };
                  this.tempData.children.push(newChild);
                  Obj = {...newChild}
                  axios.post(treeDataURL, Obj)
                }else{
                  let Child={id:++this.lastId, Pid: 1,label:tempLabel,children:[]};
                  this.tempData.children.push(Child);
                  Obj = {...Child}
                  axios.post(treeDataURL, Obj)
                }
                
                this.showInput = false;
                this.onSubmit = false;
                this.tempTitle="";
                this.$emit("added",Obj);
                
            }
        },
        queryString(val) {
        this.$refs.tree.filter(val);
      }
    }
        
    }


</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .custom-tree-container{
     margin-top:2px;

  }

.el-tree-node__content{
  height:35px;
  
}
</style>