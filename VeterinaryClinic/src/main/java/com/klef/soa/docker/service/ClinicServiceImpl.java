package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.ClinicRequest;
import com.klef.soa.docker.dto.ClinicResponse;
import com.klef.soa.docker.entity.Clinic;
import com.klef.soa.docker.repository.ClinicRepository;
@Service
public class ClinicServiceImpl implements ClinicService{
	
	@Autowired
	private ClinicRepository repo;


	@Override
	public Clinic add(ClinicRequest request) {
		Clinic c=Clinic.builder()
                       .name(request.getName())
                       .addreess(request.getAddreess())
                       .phone(request.getPhone())
                       .emergencyService(request.isEmergencyService())
                       .build();
		
		return repo.save(c);
	}


	@Override
	public List<Clinic> displayall() {
		return repo.findAll();
	}


	@Override
	public Optional<Clinic> getbyid(Long id) {
		
		return repo.findById(id);
	}


	
	@Override
	public Clinic update(ClinicRequest request, Long id) {

	    Optional<Clinic> optional = repo.findById(id);

	    if (optional.isPresent()) {

	        Clinic c = optional.get();

	        c = Clinic.builder()
	                .id(c.getId())
	                .name(request.getName())
	                .addreess(request.getAddreess())
	                .phone(request.getPhone())
	                .emergencyService(request.isEmergencyService())
	                .build();

	        return repo.save(c);
	    }

	    return null;
	}


	@Override
	public String delete(Long id) {
		boolean flag=repo.existsById(id);
		if(flag) {
			repo.deleteById(id);
			return "Sucessfully deleted";
		}
		return "not found";
	}


	
}