package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, String> {
    @Query("SELECT si FROM SaleItem si WHERE si.sale.saleCode = :saleCode")
    List<SaleItem> findBySaleCode(@Param("saleCode") String saleCode);

    @Modifying
    @Transactional
    @Query("DELETE FROM SaleItem si WHERE si.sale.saleCode = :saleCode AND si.item.itemCode = :itemCode AND si.size.sizeCode = :sizeCode AND si.colour.colourCode = :colourCode")
    int deleteBySaleAndItemAndSizeAndColour(
            @Param("saleCode") String saleCode,
            @Param("itemCode") String itemCode,
            @Param("sizeCode") String sizeCode,
            @Param("colourCode") String colourCode
    );
}
