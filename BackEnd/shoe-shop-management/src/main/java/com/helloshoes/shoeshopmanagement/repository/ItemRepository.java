package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, String> {
    @Query(value = "SELECT MAX(i.itemCode) FROM Item i")
    String findNextItemCode();

    @Query("SELECT i FROM Item i WHERE " +
            "LOWER(i.itemName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Item> searchItems(String query);
}
