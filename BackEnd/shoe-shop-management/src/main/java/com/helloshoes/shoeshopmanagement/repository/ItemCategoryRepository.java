package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, String> {
}
