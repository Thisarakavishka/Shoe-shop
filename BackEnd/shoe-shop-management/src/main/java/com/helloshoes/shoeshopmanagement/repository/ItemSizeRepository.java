package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.ItemSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemSizeRepository extends JpaRepository<ItemSize, String> {
}
