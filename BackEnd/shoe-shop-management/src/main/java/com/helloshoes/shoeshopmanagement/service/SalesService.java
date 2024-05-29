package com.helloshoes.shoeshopmanagement.service;

import com.helloshoes.shoeshopmanagement.dto.SaleDTO;

import java.util.Date;
import java.util.List;

public interface SalesService extends SuperService<SaleDTO>{
    String getNextSaleCode();

    List<SaleDTO> getSalesWithinDateRange(Date startDate, Date endDate);
}
