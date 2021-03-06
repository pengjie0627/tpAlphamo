import { Component, Vue, Watch } from 'vue-property-decorator'
import QueryCondition from 'cmp/QueryCondition.vue'
import ConstantMgr from 'mgr/ConstantMgr'
import FilterParam from 'model/request/FilterParam'
import QueryParam from 'model/request/QueryParam'
import WarehouseApi from 'http/basicdata/warehouses/WarehouseApi'
import Warehouse from 'model/basicdata/warehouses/Warehouse'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import Customer from 'model/basicdata/customer/Customer'
import Search from 'cmp/Search.vue'

// 销售单查询数据对象
class InventoryCondition {
  warehouse: string = '' // 仓库
  sku: string = '' // 商品类型
  keyword: string = '' // 关键字
  manager: Customer | null = null // 经办人
  managerName: string = '' // 经办人名称
  billNumber: string = '' // 单号
  externalBillNum: string = '' // 定单号
  businessNum: string = '' // 业务单号
  businessDate: string[] = [] // 入库时间
  createDate: string[] = [] // 制单时间
  status: string = '' // 状态
  remark: string = '' // 备注
}

@Component({
  components: {
    QueryCondition,
    Search
  }
})
export default class InventoryInSearch extends Vue {
  // 查询数据对象
  queryCondition: InventoryCondition = new InventoryCondition()
  // 界面长度限制
  limits = ConstantMgr.limits.inventory
  // 仓库列表
  warehouseList: Warehouse[] = []
  // 商品类型列表
  skuCategory: SkuCategory[] = []
  $refs: {
    manager: any
    query: any
  }

  created() {
    this.doGetWarehouseList()
  }

  @Watch('$route')
  onRouteChange(to: any, from: any) {
    if (from.name !== 'inventoryInView' && from.name !== 'inventoryInList' && to.name === 'inventoryInList') {
      this.doReset()
      this.$refs.query.doToggle()
    }
  }

  /**
   * 查询参数设置
   */
  doSearch() {
    let filters: FilterParam[] = []
    if (this.queryCondition.sku) {
      filters.push(new FilterParam('skuName:%=%', this.queryCondition.sku))
    }
    if (this.queryCondition.managerName) {
      filters.push(new FilterParam('managerName:=', this.queryCondition.managerName))
    }
    if (this.queryCondition.keyword) {
      filters.push(new FilterParam('keyword:%=%', this.queryCondition.keyword))
    }
    if (this.queryCondition.warehouse) {
      filters.push(new FilterParam('warehouseUuid:=', this.queryCondition.warehouse))
    }
    if (this.queryCondition.billNumber) {
      filters.push(new FilterParam('billNum:%=%', this.queryCondition.billNumber))
    }
    if (this.queryCondition.externalBillNum) {
      filters.push(new FilterParam('externalBillNum:%=%', this.queryCondition.externalBillNum))
    }
    if (this.queryCondition.businessNum) {
      filters.push(new FilterParam('sourceBillNum:%=%', this.queryCondition.businessNum))
    }
    if (this.queryCondition.businessDate && this.queryCondition.businessDate.length) {
      filters.push(new FilterParam('businessDate:[,]', this.queryCondition.businessDate))
    }
    if (this.queryCondition.createDate && this.queryCondition.createDate.length) {
      filters.push(new FilterParam('created:[,]', this.queryCondition.createDate))
    }
    if (this.queryCondition.remark) {
      filters.push(new FilterParam('remark:%=%', this.queryCondition.remark))
    }
    if (this.queryCondition.status) {
      filters.push(new FilterParam('status:=', this.queryCondition.status))
    }
    this.$emit('setFilters', filters)
  }

  /**
   * 重置搜索条件
   */
  doReset() {
    let filters: FilterParam[] = []
    this.queryCondition = new InventoryCondition()
    console.log(this.$refs.manager)
    this.$emit('setFilters', filters)
  }

  /**
   * 展开与收起
   * @param {boolean} flag
   */
  doToggle(flag: boolean) {
    this.queryCondition = new InventoryCondition()
  }

  /**
   * 获取仓库列表
   */
  doGetWarehouseList() {
    let query: QueryParam = new QueryParam()
    WarehouseApi.query(query).then((res) => {
      this.warehouseList = res.data
    }).catch((err) => {
      this.$message.error(err.message)
    })
  }

  setRowCustomer(customer: Customer) {
    if (!customer) {
      return new Customer()
    }
    this.queryCondition.manager = customer
  }

  onCustomerClear() {
    this.queryCondition.manager = null
  }

  doEnterSearch() {
    this.doSearch()
  }
}

