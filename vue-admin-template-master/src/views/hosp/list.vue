<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select
          @change="provinceChanged"
          placeholder="请选择省"
          v-model="searchObj.provinceCode">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-for="item in provinceList"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select
          placeholder="请选择市"
          v-model="searchObj.cityCode">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-for="item in cityList"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input placeholder="医院名称" v-model="searchObj.hosname"/>
      </el-form-item>

      <el-button @click="fetchData()" icon="el-icon-search" type="primary">查询</el-button>
      <el-button @click="resetData()" type="default">清空</el-button>
    </el-form>

    <!-- banner列表 -->
    <el-table :data="list" border
              fit
              highlight-current-row
              v-loading="listLoading">

      <el-table-column
        align="center"
        label="序号"
        width="60">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="医院logo">
        <template slot-scope="scope">
          <img :src="'data:image/jpeg;base64,'+scope.row.logoData" width="80">
        </template>
      </el-table-column>

      <el-table-column label="医院名称" prop="hosname"/>
      <el-table-column label="等级" prop="param.hostypeString" width="90"/>
      <el-table-column label="详情地址" prop="param.fullAddress"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === 0 ? '未上线' : '已上线' }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"/>

      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <router-link :to="'/hospSet/hospital/show/'+scope.row.id">
            <el-button size="mini" type="primary">查看</el-button>
          </router-link>
          <router-link :to="'/hospSet/hospital/schedule/'+scope.row.hoscode">
            <el-button size="mini" type="primary">排班</el-button>
          </router-link>

          <el-button @click="updateStatus(scope.row.id, 0)" size="mini" type="primary" v-if="scope.row.status == 1">下线
          </el-button>
          <el-button @click="updateStatus(scope.row.id, 1)" size="mini" type="danger" v-if="scope.row.status == 0">上线
          </el-button>
        </template>

      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      :total="total"
      @current-change="fetchData"
      @size-change="changeSize"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      style="padding: 30px 0; text-align: center;"
    />
  </div>
</template>
<script>

  import hospApi from '@/api/hosp'

  export default {
    data() {
      return {
        listLoading: true, // 数据是否正在加载
        list: null, // 医院列表数据集合
        total: 0, // 数据库中的总记录数
        page: 1, // 默认页码
        limit: 10, // 每页记录数
        searchObj: {
          provinceCode: '',
          cityCode: ''
        }, // 查询表单对象
        provinceList: [], //所有省集合
        cityList: []   //所有市集合
      }
    },
    created() {
      //调用医院列表
      this.fetchData()
      //调用查询所有省的方法
      this.findAllProvince()
    },
    methods: {
      //更新医院上线状态
      updateStatus(id, status) {
        hospApi.updateStatus(id, status)
          .then(response => {
            //刷新页面
            this.fetchData(1)
          })
      },
      //医院列表
      fetchData(page = 1) {
        this.page = page
        hospApi.getHospList(this.page, this.limit, this.searchObj)
          .then(response => {
            //每页数据集合
            this.list = response.data.content
            //总记录数
            this.total = response.data.totalElements
            //加载图表不显示
            this.listLoading = false
          })
      },
      //查询所有省
      findAllProvince() {
        hospApi.findByDictCode('Province')
          .then(response => {
            this.provinceList = response.data
          })
      },
      //点击某个省，显示里面市（联动）
      provinceChanged() {
        //初始化值
        this.cityList = []
        this.searchObj.cityCode = null
        //调用方法，根据省id，查询下面子节点
        hospApi.findChildId(this.searchObj.provinceCode)
          .then(response => {
            this.cityList = response.data
          })
      },
      //分页，页码变化
      changeSize() {
        this.limit = size
        this.fetchData(1)
      }
    }
  }
</script>
