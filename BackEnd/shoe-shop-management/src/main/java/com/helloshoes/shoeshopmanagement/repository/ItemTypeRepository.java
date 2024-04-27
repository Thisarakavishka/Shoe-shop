package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, String> {
}
