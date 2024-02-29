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

export { PageIn, Query, OrderBy, Scope, In }
