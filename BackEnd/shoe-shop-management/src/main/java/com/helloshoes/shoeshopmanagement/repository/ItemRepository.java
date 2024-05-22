package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    @Query(value = "SELECT MAX(i.itemCode) FROM Item i")
    String findNextItemCode();

    @Query("SELECT i FROM Item i WHERE " +
            "LOWER(i.itemName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Item> searchItems(String query);

    @Query("SELECT i FROM Item i " +
            "WHERE (:query IS NULL OR LOWER(i.itemName) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "AND (:type IS NULL OR :type = '' OR EXISTS (SELECT t FROM i.types t WHERE t.typeName = :type)) " +
            "AND (:category IS NULL OR :category = '' OR EXISTS (SELECT c FROM i.categories c WHERE c.categoryName = :category)) " +
            "AND (:supplier IS NULL OR :supplier = '' OR EXISTS (SELECT s FROM i.suppliers s WHERE s.supplierName = :supplier))")
    Page<Item> searchItems(@Param("query") String query,
                           @Param("type") String type,
                           @Param("category") String category,
                           @Param("supplier") String supplier,
                           Pageable pageable);
}
