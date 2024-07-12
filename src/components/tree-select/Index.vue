<script setup>
import {
  reactive,
  ref,
  computed,
  nextTick,
  defineProps,
  defineEmits,
} from 'vue'
import { subTags, productsList } from '../../api/contentHubService'

const emit = defineEmits(['setFiler'])

const props = defineProps({
  placeholder: String,
  treeList: Array,
  // 默认是正常尺寸，size为mini时，隐藏选中结果列表
  size: String,
  categoryId: Number,
})

const defaultProps = {
  children: 'children',
  label: 'tagName',
}

// 选择框
const select = ref()
const selectedValue = ref()
const tempInput = ref()
const removeMember = () => {
  if (checkedList.value && checkedList.value.length > 0) {
    setUnChecked(checkedList.value[0], true)
  }
}

// 搜索
const searchParams = reactive({
  name: '',
})
const getList = () => {}
const searchNode = () => {}

// 树
const tree = ref()
const filterValue = ref()
// 加载子节点
const loadNode = async (node, resolve) => {
  if (node.level === 0) {
    return resolve(props.treeList)
  }
  if (node.level >= 1) {
    if (node.data.isLast) {
      return resolve([])
    }
    const info = {
      page: 1,
      pageSize: 500,
      parentTagId: node.data.tagId,
    }
    const { success, data } = await subTags(info)
    if (success) {
      return resolve(data.list)
    }
  }
}

const onChecked = (node, statusObj) => {
  console.log('node', node)
  console.log('statusObj', statusObj)
  const _node = tree.value.getNode(node)
  const checkedNodes = statusObj.checkedNodes
  const tempList = []
  checkedNodes.forEach((item) => {
    tempList.push(item)
  })
  checkedList.value = tempList
}
const handleCheckChange = () => {}

// 右侧结果面板
const checkedList = ref([])
const checkedNum = computed(() => {
  let num = 0
  checkedList.value.forEach((item) => {
    num++
  })
  return num
})
// 取消选择
const setUnChecked = (choosenItem, isFresh) => {
  tree.value.setChecked(choosenItem.tagId, false, true)
  for (let i = 0; i < checkedList.value.length; i++) {
    const item = checkedList.value[i]
    if (item.tagId === choosenItem.tagId) {
      checkedList.value.splice(i, 1)
      break
    }
  }
  // 外部input框移除选项
  if (isFresh) {
    const checkedNodes = tree.value.getCheckedNodes()
    const tempList = []
    checkedNodes.forEach((item) => {
      tempList.push(item)
    })
    checkedList.value = tempList
    handleConfirm()
  } else {
    // 右侧选择结果内，移除选项
    const checkedNodes = tree.value.getCheckedNodes()
    const tempList = []
    checkedNodes.forEach((item) => {
      tempList.push(item)
    })
    checkedList.value = tempList
  }
}

// 确认按钮
const handleConfirm = () => {
  let names = []
  let ids = []
  checkedList.value.forEach((item) => {
    names.push(item.tagName)
    ids.push(item.tagId)
  })
  selectedValue.value = names
  emit('setFiler', ids)
  nextTick(() => {
    tempInput.value.focus()
  })
  console.log('selectedValue', selectedValue.value)
}
// 取消筛选
const cancelConfirm = () => {
  nextTick(() => {
    tempInput.value.focus()
  })
}
</script>
<template>
  <div class="tree-selec-box" :class="{ 'mini-mode': size === 'mini' }">
    <el-select
      ref="select"
      v-model="selectedValue"
      multiple
      collapse-tags
      placeholder="请选择"
      :teleported="false"
      @remove-tag="removeMember(null)"
    >
      <el-option ref="option" label="" value="" disabled />
      <div class="tree-selec-content">
        <div class="tree-selec-left">
          <div class="tree-select-input"></div>
          <div class="tree-select-list" v-if="treeList && treeList.length">
            <el-tree
              ref="tree"
              lazy
              v-model="filterValue"
              multiple
              filterable
              :render-after-expand="false"
              node-key="tagId"
              show-checkbox
              @check="onChecked"
              :props="defaultProps"
              @check-change="handleCheckChange"
              :load="loadNode"
            >
            </el-tree>
          </div>
        </div>
        <div class="tree-selec-right">
          <p>已选择（{{ checkedNum }}）</p>
          <ul class="result-list">
            <li
              v-for="(checkedItem, checkedIndex) in checkedList"
              :key="checkedIndex"
              @click="setUnChecked(checkedItem)"
            >
              <span>{{ checkedItem.tagName }}</span>
              <i
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                >
                  <path
                    fill="currentColor"
                    d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                  ></path>
                </svg>
              </i>
            </li>
          </ul>
        </div>
        <div class="confirm-box">
          <el-button @click="cancelConfirm">取消</el-button>
          <el-button @click="handleConfirm">确定</el-button>
        </div>
      </div>
    </el-select>
    <input type="text" id="tempInput" ref="tempInput" />
  </div>
</template>
<style scoped lang="scss">
.tree-selec-box {
  display: flex;
  .el-select {
    width: 100%;
  }
  // overflow: hidden;
  .el-select-dropdown__item.is-disabled {
    display: none;
  }
  .tree-selec-content {
    padding-bottom: 30px;
    // display: flex;
    .tree-selec-left {
      float: left;
      width: 60%;
      flex: 1;
      margin-right: 1%;
      padding: 20px;
      flex-grow: 0;
      flex-shrink: 0;
      .tree-select-input {
      }
      ::v-deep .el-tree-node {
        white-space: normal;
      }
      ::v-deep .el-tree-node__content {
        height: auto;
        --el-checkbox-height: auto;
      }
    }
    .tree-selec-right {
      width: 38%;
      float: right;
      flex-grow: 0;
      flex-shrink: 0;
      flex: 1;
      padding: 20px 0;
      overflow-x: auto;
      min-height: 200px;
      .result-list {
        li {
          margin: 6px 0;
          display: flex;
          align-items: center;
          padding: 2px 15px;
          color: rgb(96, 98, 102);
          font-size: 13px;
          &:hover {
            background: #f5f7fa;
          }
          span {
            flex: 1;
            margin-right: 4px;
          }
          i {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }
        }
        .hide {
          display: none;
        }
      }
    }
  }
  .confirm-box {
    position: absolute;
    right: 0px;
    bottom: 0px;
    text-align: right;
    padding: 20px;
  }
  &.mini-mode {
    .tree-selec-content {
      padding-bottom: 50px;
    }
    .tree-selec-left {
      padding: 10px;
    }
    .tree-selec-left {
      width: 100%;
    }
    .tree-selec-right {
      display: none;
    }
  }
}

#tempInput {
  width: 0px;
  opacity: 0;
}
</style>
