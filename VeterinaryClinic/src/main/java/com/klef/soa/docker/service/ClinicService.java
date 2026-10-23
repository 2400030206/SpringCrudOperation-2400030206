package com.klef.soa.docker.service;

import java.util.List;
import java.util.Optional;

import com.klef.soa.docker.dto.ClinicRequest;
import com.klef.soa.docker.dto.ClinicResponse;
import com.klef.soa.docker.entity.Clinic;

public interface ClinicService {

	
	Clinic add(ClinicRequest request);
	List<Clinic> displayall();
	Optional<Clinic> getbyid(Long id);
	Clinic update(ClinicRequest request,Long id);
	String delete(Long id);
}
