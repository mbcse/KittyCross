# KittyCross


# KittyCross



### Kitty Cross Image Generator Server

=== GET /taxi 

"Scam"

=== GET /kitties 
retrieves all IPFS urls for a requested set of kitties, creating the missing ones

request (json)

[
    {
        "id" : 1000,
        "chain" : 0,
        "genes" : [31,19,8,10,9,24,23,17]
    },
    {
        "id" : 1001,
        "chain" : 1,
        "genes" : [31,19,8,10,9,24,23,0]
    }
]

response (json)

{
    "1000": "https://gateway.pinata.cloud/ipfs/QmcexV89gWivPh5NaRzdnLJdLPK3tVXpd8aKsjdsCbFM7E",
    "1001": "https://gateway.pinata.cloud/ipfs/QmQCDauymDNbGWUWp6qh5pScRziTjxcX6Epukm6eZYYErP"
}


=== GET /storage
retrieves all entries currently known and the url in IPFS

response (json)

{
    "1000": "https://gateway.pinata.cloud/ipfs/QmcexV89gWivPh5NaRzdnLJdLPK3tVXpd8aKsjdsCbFM7E",
    "1001": "https://gateway.pinata.cloud/ipfs/QmQCDauymDNbGWUWp6qh5pScRziTjxcX6Epukm6eZYYErP"
}
