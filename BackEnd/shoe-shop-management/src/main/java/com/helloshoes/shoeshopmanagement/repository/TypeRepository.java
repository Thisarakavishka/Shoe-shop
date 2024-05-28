package com.helloshoes.shoeshopmanagement.repository;

import com.helloshoes.shoeshopmanagement.entity.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeRepository extends JpaRepository<Type, String> {
    @Query(value = "SELECT t FROM Type t WHERE t.typeName = :typeName")
    Type findByTypeName(@Param("typeName") String typeName);

    @Query(value = "SELECT MAX(t.typeCode) FROM Type t")
    String findNextTypeCode();
}
