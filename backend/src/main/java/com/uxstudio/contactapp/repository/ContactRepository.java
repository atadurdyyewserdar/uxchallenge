package com.uxstudio.contactapp.repository;

import com.uxstudio.contactapp.model.Contact;
import org.springframework.data.mongodb.repository.DeleteQuery;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactRepository extends MongoRepository<Contact, String> {
    List<Contact> findContactsByOwnerUserName(String ownerUserName);
    Optional<Contact> findContactByIdAndOwnerUserName(String id, String ownerUserName);
    long deleteContactByIdAndOwnerUserName(String id, String ownerUserName);
}
