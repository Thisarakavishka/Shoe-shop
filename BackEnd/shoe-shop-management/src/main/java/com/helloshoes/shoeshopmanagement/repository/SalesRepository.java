package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface SalesRepository extends JpaRepository<Sales, String> {
    @Query(value = "SELECT MAX(s.saleCode) FROM Sales s")
    String findNextSaleCode();

    @Query("SELECT s FROM Sales s WHERE s.date >= :startDate AND s.date <= :endDate")
    List<Sales> findSalesWithinDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
