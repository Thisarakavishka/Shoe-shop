package com.helloshoes.shoeshopmanagement.dto;

import com.helloshoes.shoeshopmanagement.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundDTO {
    private String saleCode;
    private Double totalRefund;
    private Date date;
    private Integer addedPoints;
    private String employeeCode;
    private String refundDescription;
    private List<ItemDTO> items;
}
