<template>
   
  <div
     class="app-container">
           
    <div class="el-toolbar">
      <div class="el-toolbar-body" style="justify-content: flex-start;">
        <el-button @click="exportData" type="text"><i class="fa fa-plus"/> 导出</el-button>
        <el-button @click="importData" type="text"><i class="fa fa-plus"/> 导入</el-button>
      </div>
    </div>
     
    <el-table
       :data="list"
              :load="getChildrens"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              border
              lazy
              row-key="id"
              style="width: 100%">
                  
      <el-table-column
         align="left"  label="名称"  width="230">
                    
        <template
           slot-scope="scope">
                      <span>{{ scope.row.name }}</span>
                      
        </template>
                    
      </el-table-column>

                  
      <el-table-column
         label="编码"  width="220">
                    
        <template
           slot-scope="{row}">
                              {{ row.dictCode }}
                      
        </template>
                    
      </el-table-column>
                  
      <el-table-column
         align="left"  label="值"  width="230">
                    
        <template
           slot-scope="scope">
                      <span>{{ scope.row.value }}</span>
                      
        </template>
                    
      </el-table-column>
                  
      <el-table-column
         align="center"  label="创建时间">
                    
        <template
           slot-scope="scope">
                      <span>{{ scope.row.createTime }}</span>
                      
        </template>
                    
      </el-table-column>
              
    </el-table>
    <el-dialog :visible.sync="dialogImportVisible" title="导入" width="480px">
      <el-form label-position="right" label-width="170px">

        <el-form-item label="文件">
          <el-upload
            :action="'http://localhost:8202/admin/cmn/dict/importData'"
            :multiple="false"
            :on-success="onUploadSuccess"
            class="upload-demo">
            <el-button size="small" type="primary">点击上传</el-button>
            <div class="el-upload__tip" slot="tip">只能上传excel文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div class="dialog-footer" slot="footer">
        <el-button @click="dialogImportVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>
        
  </div>
</template>

<script>
  import dict from '@/api/dict'

  export default {
    data() {
      return {
        list: [] ,//数据字典列表数组
        dialogImportVisible: false
      }
    },
    created() {
      this.getDictList(1)
    },
    methods: {
      onUploadSuccess(response, file) {
        this.$message.info('上传成功')
        this.dialogImportVisible = false
        //刷新界面
        this.getDictList(1)
      },
      //导入数据字典
      importData() {
        this.dialogImportVisible = true
      },

      //导出数据字典
      exportData() {
        window.location.href = 'http://localhost:8202/admin/cmn/dict/exportData'
      },
      //数据字典列表
      getDictList(id) {
        dict.dictList(id)
          .then(response => {
            this.list = response.data
          })
      },
      //查询下面层级
      getChildrens(tree, treeNode, resolve) {
        dict.dictList(tree.id).then(response => {
          resolve(response.data)
        })
      }
    }
  }

</script>

<style scoped>

</style>
