package com.atguigu.yygh.hosp.service;

import com.atguigu.yygh.model.hosp.Hospital;

import java.util.Map;

public interface HospitalService {
    //上传医院方法
    void save(Map<String, Object> paramMap);

    //根据医院编号进行查询
    Hospital getByHoscode(String hoscode);
}
