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
public class SaleDTO {
    private String saleCode;
    private Double totalPrice;
    private PaymentMethod paymentMethod;
    private Integer addedPoints;
    private Date date;
    private String employeeCode;
    private String customerCode;
    private List<ItemDTO> items;
}
