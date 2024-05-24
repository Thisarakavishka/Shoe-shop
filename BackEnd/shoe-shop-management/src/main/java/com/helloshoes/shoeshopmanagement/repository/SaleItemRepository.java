package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, String> {
    @Query("SELECT si FROM SaleItem si WHERE si.sale.saleCode = :saleCode")
    List<SaleItem> findBySaleCode(@Param("saleCode") String saleCode);
}
