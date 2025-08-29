// HomeHarvest Web App JavaScript for Cloudflare Pages

$(document).ready(function() {
    
    // Global variables
    let currentResults = [];
    let searchStats = {
        totalSearches: 0,
        avgPrice: 450000,
        propertiesFound: 0
    };
    
    // Initialize the app
    initializeApp();
    
    function initializeApp() {
        console.log('HomeHarvest Web App initialized');
        
        // Bind event handlers
        bindEventHandlers();
        
        // Initialize components
        initializeLocationAutocomplete();
        
        // Load saved stats
        loadSearchStats();
        
        // Initialize animations
        initializeAnimations();
    }
    
    function bindEventHandlers() {
        // Form submission
        $('#searchForm').on('submit', handleSearch);
        
        // Download functionality
        $('#downloadBtn').on('click', handleDownload);
    }
    
    function initializeLocationAutocomplete() {
        const locationInput = $('#location');
        const suggestionsContainer = $('#locationSuggestions');
        
        // Popular US cities for suggestions
        const popularLocations = [
            'Los Angeles, CA', 'New York, NY', 'Chicago, IL', 'Houston, TX',
            'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
            'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
            'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC', 'San Francisco, CA',
            'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
            'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI',
            'Oklahoma City, OK', 'Portland, OR', 'Las Vegas, NV', 'Memphis, TN',
            'Louisville, KY', 'Baltimore, MD', 'Milwaukee, WI', 'Albuquerque, NM',
            'Beverly Hills, CA', 'Manhattan, NY', 'Brooklyn, NY', 'Miami, FL'
        ];
        
        locationInput.on('input', function() {
            const query = $(this).val().toLowerCase().trim();
            
            if (query.length >= 2) {
                const matches = popularLocations.filter(location => 
                    location.toLowerCase().includes(query)
                ).slice(0, 5);
                
                if (matches.length > 0) {
                    showLocationSuggestions(matches);
                } else {
                    hideLocationSuggestions();
                }
            } else {
                hideLocationSuggestions();
            }
        });
        
        // Hide suggestions when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('#location, #locationSuggestions').length) {
                hideLocationSuggestions();
            }
        });
    }
    
    function showLocationSuggestions(suggestions) {
        const container = $('#locationSuggestions');
        container.empty();
        
        suggestions.forEach(location => {
            const suggestion = $(`
                <div class="search-suggestion" data-location="${location}">
                    <i class="fas fa-map-marker-alt me-2"></i>${location}
                </div>
            `);
            
            suggestion.on('click', function() {
                $('#location').val($(this).data('location'));
                hideLocationSuggestions();
            });
            
            container.append(suggestion);
        });
        
        container.show();
    }
    
    function hideLocationSuggestions() {
        $('#locationSuggestions').hide();
    }
    
    function handleSearch(e) {
        e.preventDefault();
        
        // Show loading state
        showLoadingState();
        
        // Collect form data
        const formData = collectFormData();
        
        // Validate required fields
        if (!validateFormData(formData)) {
            hideLoadingState();
            return;
        }
        
        // Send search request to Cloudflare Function
        performSearch(formData);
    }
    
    function collectFormData() {
        const formData = {
            location: $('#location').val().trim(),
            listing_type: $('input[name="listing_type"]:checked').val(),
            property_type: [],
            past_days: $('input[name="past_days"]').val(),
            limit: $('select[name="limit"]').val(),
            mls_only: $('#mls_only').is(':checked')
        };
        
        // Collect selected property types
        $('input[name="property_type"]:checked').each(function() {
            formData.property_type.push($(this).val());
        });
        
        return formData;
    }
    
    function validateFormData(formData) {
        // Clear previous validation states
        $('.form-control, .form-select').removeClass('is-invalid');
        $('.invalid-feedback').remove();
        
        let isValid = true;
        
        // Validate location
        if (!formData.location) {
            showFieldError('#location', 'Location is required');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(selector, message) {
        const field = $(selector);
        field.addClass('is-invalid');
        field.after(`<div class="invalid-feedback">${message}</div>`);
    }
    
    function performSearch(formData) {
        // For Cloudflare Pages demo, we'll simulate the search
        // In production, this would call the Cloudflare Function
        
        setTimeout(() => {
            // Simulate search response
            const mockResults = generateMockResults(formData);
            handleSearchSuccess(mockResults);
            hideLoadingState();
        }, 2000);
        
        // Uncomment this for actual API call to Cloudflare Function
        /*
        $.ajax({
            url: '/api/search',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            timeout: 60000,
            success: function(response) {
                handleSearchSuccess(response);
            },
            error: function(xhr) {
                handleSearchError(xhr);
            },
            complete: function() {
                hideLoadingState();
            }
        });
        */
    }
    
    function generateMockResults(formData) {
        // Generate mock property results for demo
        const mockProperties = [];
        const count = Math.min(parseInt(formData.limit) || 10, 10);
        
        const sampleProperties = [
            {
                street: '123 Ocean Drive',
                city: 'Beverly Hills',
                state: 'CA',
                zip_code: '90210',
                beds: 4,
                full_baths: 3,
                sqft: 2850,
                list_price: 1250000,
                status: 'for_sale',
                style: 'Single Family',
                year_built: 2015,
                property_url: 'https://realtor.com/sample-listing'
            },
            {
                street: '456 Park Avenue',
                city: 'Manhattan',
                state: 'NY',
                zip_code: '10016',
                beds: 2,
                full_baths: 2,
                sqft: 1400,
                list_price: 875000,
                status: 'for_sale',
                style: 'Condo',
                year_built: 2020,
                property_url: 'https://realtor.com/sample-listing-2'
            },
            {
                street: '789 Sunset Boulevard',
                city: 'Los Angeles',
                state: 'CA',
                zip_code: '90028',
                beds: 3,
                full_baths: 2,
                sqft: 1950,
                list_price: 950000,
                status: 'for_sale',
                style: 'Townhome',
                year_built: 2018,
                property_url: 'https://realtor.com/sample-listing-3'
            }
        ];
        
        for (let i = 0; i < count; i++) {
            const base = sampleProperties[i % sampleProperties.length];
            const variation = {
                ...base,
                street: `${100 + i} ${base.street.split(' ').slice(1).join(' ')}`,
                list_price: base.list_price + (Math.random() - 0.5) * 200000,
                sqft: base.sqft + Math.floor((Math.random() - 0.5) * 500),
                beds: Math.max(1, base.beds + Math.floor((Math.random() - 0.5) * 2))
            };
            mockProperties.push(variation);
        }
        
        return {
            count: mockProperties.length,
            properties: mockProperties,
            message: `Found ${mockProperties.length} properties`,
            columns: Object.keys(mockProperties[0] || {})
        };
    }
    
    function handleSearchSuccess(response) {
        console.log('Search successful:', response);
        
        if (response.count === 0) {
            showNoResults();
            return;
        }
        
        // Store results
        currentResults = response.properties || [];
        
        // Update search stats
        updateSearchStats(response);
        
        // Display results
        displayResults(response);
        
        // Show success notification
        showSuccessNotification(`Found ${response.count} properties!`);
    }
    
    function handleSearchError(xhr) {
        console.error('Search error:', xhr);
        
        let errorMessage = 'An error occurred while searching for properties.';
        
        if (xhr.responseJSON && xhr.responseJSON.error) {
            errorMessage = xhr.responseJSON.error;
        } else if (xhr.status === 0) {
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        showError(errorMessage);
    }
    
    function displayResults(response) {
        const { properties, count } = response;
        
        // Update result count
        $('#resultCount').text(`${count} properties`);
        
        // Display property cards
        displayPropertyCards(properties);
        
        // Show download button (mock)
        $('#downloadBtn').show();
        
        // Hide welcome section and show results
        $('#welcomeSection').hide();
        $('#resultsSection').show().addClass('fade-in-up');
    }
    
    function displayPropertyCards(properties) {
        const container = $('#propertyCards');
        container.empty();
        
        properties.forEach((property, index) => {
            const card = createPropertyCard(property, index);
            container.append(card);
        });
        
        // Initialize card animations
        setTimeout(() => {
            $('.property-card').each(function(index) {
                setTimeout(() => {
                    $(this).addClass('fade-in-up');
                }, index * 100);
            });
        }, 100);
    }
    
    function createPropertyCard(property, index) {
        const price = property.list_price || property.sold_price || 0;
        const address = `${property.street || ''}, ${property.city || ''}, ${property.state || ''}`;
        const beds = property.beds || 'N/A';
        const baths = (property.full_baths || 0) + (property.half_baths || 0) * 0.5;
        const sqft = property.sqft || 'N/A';
        const status = property.status || 'unknown';
        const propertyUrl = property.property_url || '#';
        
        return $(`
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="property-card" data-index="${index}">
                    <div class="property-image">
                        <i class="fas fa-home"></i>
                        <div class="property-status status-${status.toLowerCase().replace(' ', '-')}">
                            ${status.toUpperCase()}
                        </div>
                    </div>
                    <div class="property-details">
                        <div class="property-price">
                            ${formatCurrency(price)}
                        </div>
                        <div class="property-address">
                            <i class="fas fa-map-marker-alt me-1"></i>
                            ${address}
                        </div>
                        <div class="property-features">
                            <div class="property-feature">
                                <i class="fas fa-bed"></i>
                                <span>${beds} beds</span>
                            </div>
                            <div class="property-feature">
                                <i class="fas fa-bath"></i>
                                <span>${baths} baths</span>
                            </div>
                            <div class="property-feature">
                                <i class="fas fa-ruler-combined"></i>
                                <span>${typeof sqft === 'number' ? sqft.toLocaleString() : sqft} sq ft</span>
                            </div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <button class="btn btn-outline-primary btn-sm" onclick="showPropertyDetails(${index})">
                                <i class="fas fa-info-circle me-1"></i>Details
                            </button>
                            <a href="${propertyUrl}" target="_blank" class="btn btn-primary btn-sm">
                                <i class="fas fa-external-link-alt me-1"></i>View Listing
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    
    function formatCurrency(amount) {
        if (!amount || isNaN(amount)) return 'Price N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    function updateSearchStats(response) {
        searchStats.totalSearches++;
        searchStats.propertiesFound += response.count;
        
        if (response.properties && response.properties.length > 0) {
            const prices = response.properties
                .map(p => p.list_price || p.sold_price)
                .filter(p => p && !isNaN(p));
                
            if (prices.length > 0) {
                searchStats.avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
            }
        }
        
        // Update display
        $('#totalSearches').text(searchStats.totalSearches);
        $('#avgPrice').text(formatCurrency(searchStats.avgPrice));
        $('#propertiesFound').text(searchStats.propertiesFound.toLocaleString());
        
        // Save to localStorage
        localStorage.setItem('homeharvestStats', JSON.stringify(searchStats));
    }
    
    function loadSearchStats() {
        const saved = localStorage.getItem('homeharvestStats');
        if (saved) {
            searchStats = JSON.parse(saved);
            $('#totalSearches').text(searchStats.totalSearches);
            $('#avgPrice').text(formatCurrency(searchStats.avgPrice));
            $('#propertiesFound').text(searchStats.propertiesFound.toLocaleString());
        }
    }
    
    function showLoadingState() {
        // Hide all sections
        hideAllSections();
        
        // Show loading overlay
        $('#loadingSpinner').show();
        
        // Disable search button
        const searchBtn = $('#searchBtn');
        searchBtn.prop('disabled', true);
        searchBtn.find('.search-btn-text').text('Searching...');
        searchBtn.find('.spinner-border').removeClass('d-none');
        
        // Show progress animation
        showSearchProgress();
    }
    
    function showSearchProgress() {
        const progressContainer = $('#searchProgress');
        const progressBar = $('.progress-bar');
        const progressText = $('#progressText');
        
        progressContainer.show();
        
        // Animate progress
        const stages = [
            { progress: 20, text: 'Connecting to property database...' },
            { progress: 50, text: 'Searching properties...' },
            { progress: 80, text: 'Processing results...' },
            { progress: 100, text: 'Finalizing...' }
        ];
        
        let currentStage = 0;
        const progressInterval = setInterval(() => {
            if (currentStage < stages.length) {
                const stage = stages[currentStage];
                progressBar.css('width', stage.progress + '%');
                progressText.text(stage.text);
                currentStage++;
            } else {
                clearInterval(progressInterval);
            }
        }, 500);
        
        // Store interval to clear it when search completes
        window.searchProgressInterval = progressInterval;
    }
    
    function hideLoadingState() {
        // Clear progress interval
        if (window.searchProgressInterval) {
            clearInterval(window.searchProgressInterval);
        }
        
        // Hide loading elements
        $('#loadingSpinner').hide();
        $('#searchProgress').hide();
        
        // Reset search button
        const searchBtn = $('#searchBtn');
        searchBtn.prop('disabled', false);
        searchBtn.find('.search-btn-text').text('Search Properties');
        searchBtn.find('.spinner-border').addClass('d-none');
        
        // Reset progress bar
        $('.progress-bar').css('width', '0%');
        $('#progressText').text('Initializing search...');
    }
    
    function initializeAnimations() {
        // Add entrance animations to existing elements
        setTimeout(() => {
            $('.fade-in-up').addClass('animate');
        }, 500);
    }
    
    function showSuccessNotification(message) {
        const notification = $(`
            <div class="alert alert-success alert-dismissible fade show position-fixed" 
                 style="top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
                <i class="fas fa-check-circle me-2"></i>${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.fadeOut(() => notification.remove());
        }, 5000);
    }
    
    function showNoResults() {
        hideAllSections();
        
        const noResultsHtml = `
            <div class="text-center py-5">
                <i class="fas fa-search display-1 text-muted mb-4"></i>
                <h4>No Properties Found</h4>
                <p class="text-muted mb-4">
                    No properties found with the specified criteria. 
                    Try adjusting your search parameters.
                </p>
                <button class="btn btn-primary" onclick="$('#location').focus()">
                    <i class="fas fa-search me-2"></i>Try New Search
                </button>
            </div>
        `;
        
        $('#propertyCards').html(noResultsHtml);
        $('#resultsSection').show().addClass('fade-in-up');
    }
    
    function showError(message) {
        hideAllSections();
        $('#errorMessage').text(message);
        $('#errorSection').show().addClass('fade-in-up');
    }
    
    function hideAllSections() {
        $('#welcomeSection, #resultsSection, #errorSection')
            .hide().removeClass('fade-in-up');
    }
    
    function handleDownload() {
        // Mock download functionality
        const csvContent = generateCSV(currentResults);
        downloadCSV(csvContent, 'homeharvest-properties.csv');
    }
    
    function generateCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(property => 
            Object.values(property).map(value => 
                typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value
            ).join(',')
        );
        
        return [headers, ...rows].join('\n');
    }
    
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    // Global function for property details (simplified for demo)
    window.showPropertyDetails = function(index) {
        const property = currentResults[index];
        if (!property) return;
        
        alert(`Property Details:\n\nAddress: ${property.street}, ${property.city}, ${property.state}\nPrice: ${formatCurrency(property.list_price)}\nBedrooms: ${property.beds}\nBathrooms: ${property.full_baths}\nSquare Feet: ${property.sqft}\n\nFor full functionality, deploy the complete Flask backend.`);
    };
});