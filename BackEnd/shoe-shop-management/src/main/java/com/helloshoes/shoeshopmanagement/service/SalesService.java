package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.RefundDTO;
import com.helloshoes.shoeshopmanagement.dto.SaleDTO;

import java.util.Date;
import java.util.List;

public interface SalesService extends SuperService<SaleDTO> {
    String getNextSaleCode();

    List<SaleDTO> getSalesWithinDateRange(Date startDate, Date endDate);

    Boolean update(String code, RefundDTO refundDTO);
}
