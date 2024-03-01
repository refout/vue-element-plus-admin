/**
 * 分页查询输入类，用于指定分页查询的参数。
 */
interface PageIn<D> {
  /**
   * 页码
   */
  page: number
  /**
   * size
   */
  size: number
  /**
   * 排序
   */
  orderBy?: Array<OrderBy>
  /**
   * 查询条件
   */
  query: Query<D>
}

/**
 * 排序方式，用于指定排序的方向和属性。
 */
interface OrderBy {
  /**
   * 排序属性
   */
  property: string
  /**
   * 排序方向
   */
  direction: Direction
}

/**
 * 排序方向
 */
enum Direction {
  /**
   * 升序
   */
  ASC,
  /**
   * 降序
   */
  DESC
}

/**
 * 查询请求
 *
 * @param <D> 数据类型
 */
interface Query<D> {
  /**
   * 数据
   */
  data?: D
  /**
   * 范围条件列表
   */
  scopes?: Array<Scope>
  /**
   * 包含条件列表
   */
  ins?: Array<In>
}

interface Column {
  /**
   * 列名
   */
  columnName: string
}

interface Scope extends Column {
  /**
   * 起始值
   */
  start: string | number | Date
  /**
   * 结束值
   */
  end: string | number | Date
}

interface In extends Column {
  /**
   * 包含的值集合
   */
  in: Array<string | number | Date>
}

/**
 * 页面输出记录
 *
 * @param D       数据类型
 * @param data      数据集合
 * @param page      当前页码
 * @param size      每页大小
 * @param total     总记录数
 * @param totalPage 总页数
 **/
interface PageOut<D> {
  /**
   * 数据集合
   */
  data: Array<D>
  /**
   * 当前页码
   */
  page: number
  /**
   * 每页大小
   */
  size: number
  /**
   * 总记录数
   */
  total: number
  /**
   * 总页数
   */
  totalPage: number
}

export { PageIn, Query, OrderBy, Scope, In, PageOut }
