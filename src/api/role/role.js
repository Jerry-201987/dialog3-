import request from '../request'
const localhost = 'http://localhost:8888'

export function getList(data) {
    return request({
        // url: `${localhost}/mock/role/list.json`,
        url: `${localhost}/mock/role/list2.json`,
        method: 'get',
        data
    })
}

export function showSetRightDialog(data) {
    return request({
        // url: `${localhost}/mock/role/list.json`,
        url: `${localhost}/mock/role/list3.json`,
        method: 'get',
        data
    })
}