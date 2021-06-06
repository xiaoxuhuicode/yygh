<template>
  <div class="app-container">
    <el-form
       :inline="true"  class="demo-form-inline">
         
      <el-form-item>
              
        <el-input
           placeholder="医院名称"   v-model="searchObj.hosname"/>
           
      </el-form-item>
         
      <el-form-item>
         
        <el-input
           placeholder="医院编号"  v-model="searchObj.hoscode"/>
           
      </el-form-item>
         
      <el-button
         @click="getList()"  icon="el-icon-search"  type="primary">查询
      </el-button>
    </el-form>
    <!-- 工具条 -->
    <div>
         
      <el-button
         @click="removeRows()"  size="mini"  type="danger">批量删除
      </el-button>
    </div>
    <!-- banner列表 -->
    <el-table
      :data="list"
      @selection-change="handleSelectionChange"
      stripe style="width: 100%">
      <el-table-column
         type="selection"  width="55"/>
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column label="医院名称" prop="hosname"/>
      <el-table-column label="医院编号" prop="hoscode"/>
      <el-table-column label="api基础路径" prop="apiUrl" width="200"/>
      <el-table-column label="联系人姓名" prop="contactsName"/>
      <el-table-column label="联系人手机" prop="contactsPhone"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '可用' : '不可用' }}
        </template>
      </el-table-column>
      <el-table-column
         align="center"  label="操作"  width="280">
           
        <template
           slot-scope="scope">
                
          <el-button
             size="mini"  type="danger"
              @click="removeDataById(scope.row.id)"          icon="el-icon-delete"> 
          </el-button>
             
          <el-button
             @click="lockHostSet(scope.row.id,0)"  size="mini"  type="primary"  v-if="scope.row.status==1"
               icon="el-icon-delete">锁定
          </el-button>
           
          <el-button
             size="mini"  type="danger"  v-if="scope.row.status==0"
              @click="lockHostSet(scope.row.id,1)"          icon="el-icon-delete">取消锁定
          </el-button>
          <router-link
           :to="'/hospSet/edit/'+scope.row.id">
             
          <el-button
           icon="el-icon-edit" size="mini" type="primary"></el-button>
          </router-link>
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
        :current-page="current"
        :page-size="limit"
        :total="total"
        @current-change="getList"
        layout="total, prev, pager, next, jumper"
        style="padding: 30px 0; text-align: center;"
    />
  </div>
</template>

<script>
  //引入接口定义的js文件
  import hospSet from '@/api/hospSet'

  export default {
    //定义变量和初始值
    data() {
      return {
        current: 1, //当前页
        limit: 3, //每页显示记录数
        searchObj: {}, //条件封装对象
        list: [], //每页数据集合
        total: 0, //总记录数
        multipleSelection: [] // 批量选择中选择的记录列表
      }
    },
    created() { //在页面渲染之前执行
      //一般调用methods定义的方法，得到数据
      this.getList()
    },
    methods: {//定义方法，进行请求接口调用
      //锁定和取消锁定
      lockHostSet(id, status) {
        hospSet.lockHospSet(id, status)
          .then(response => {
            //刷新
            this.getList()
          })
      },
      // 当表格复选框选项发生变化的时候触发
      handleSelectionChange(selection) {
        this.multipleSelection = selection
      },
      //批量删除
      removeRows() {
        this.$confirm('此操作将永久删除医院是设置信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { //确定执行then方法
          var idList = []
          //遍历数组得到每个id值，设置到idList里面
          for (var i = 0; i < this.multipleSelection.length; i++) {
            var obj = this.multipleSelection[i]
            var id = obj.id
            idList.push(id)
          }
          //调用接口
          hospSet.batchRemoveHospSet(idList)
            .then(response => {
              //提示
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //刷新页面
              this.getList(1)
            })
        })
      },
      //医院设置列表
      getList(page = 1) { //添加当前页参数
        this.current = page
        hospSet.getHospSetList(this.current, this.limit, this.searchObj)
          .then(response => { //请求成功response是接口返回数据

            // console.log(response)
            //返回集合赋值list
            this.list = response.data.records
            //总记录数
            this.total = response.data.total
          })
          .catch(error => {//请求失败
            console.log(error)
          })
      },
      //删除医院设置的方法
      removeDataById(id) {
        this.$confirm('此操作将永久删除医院是设置信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { //确定执行then方法
          //调用接口
          hospSet.deleteHospSet(id)
            .then(response => {
              //提示
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //刷新页面
              this.getList(1)
            })
        })
      }
    }
  }
</script>

<style scoped>

</style>
