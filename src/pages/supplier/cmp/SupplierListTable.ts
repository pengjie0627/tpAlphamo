import { Component, Prop, Vue } from 'vue-property-decorator'
import Sale from 'model/sale/Sale'
import { Dialog, Loading } from 'fant'
import SupplierEdit from 'pages/supplier/cmp/SupplierEdit.vue'
import QueryParam from 'model/request/QueryParam'
import PermissionMgr from 'mgr/PermissionMgr'
import SupplierApi from 'http/basicdata/supplier/SupplierApi'
import DetailInfo from 'pages/supplier/cmp/DetailInfo.vue'

@Component({
  components: { SupplierEdit, DetailInfo }
})
export default class SupplierListTable extends Vue {
  @Prop() data: Sale[]
  // 节点对象
  $refs: {
    skuTable: any
  }
  @Prop() ids: string[]
  @Prop() query: QueryParam

  // 权限
  hasPermissions: Function = PermissionMgr.hasOptionPermission

  doDelete(id: string, version: number) {
    this.$msgBox.confirm('批量删除', '您是否确认删除选中供应商？', () => {
      let loading = Loading.show()
      SupplierApi.delete(id, version).then(resp => {
        loading.hide()
        this.$emit('hide')
        this.$message.success('删除成功')
        this.getList()
      }).catch(error => {
        loading.hide()
        this.$message.error(error.message)
      })
    })
  }

  /**
   * 表格排序条件
   */
  doSortChange({ column, prop, order }: any) {
    order === 'ascending' ? (order = 'ASC') : (order = 'DESC')
    let sorters = []
    column && prop && order && sorters.push({ 'property': prop, 'direction': order })
    this.$emit('setSorters', sorters)
  }

  /**
   * 表格选择
   * @param val
   */
  doSelectionChange(val: Sale[]) {
    this.$emit('selectData', val)
  }

  getList() {
    this.$emit('getList')
  }

  doEdit(id: string) {
    new Dialog(SupplierEdit, {
      id: id,
      onConfirm: () => {
        this.$emit('reload')
      }
    }).show()
  }

}

