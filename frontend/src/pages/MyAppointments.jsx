import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`
  }

  const getUserAppointments = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        backendUrl + '/api/user/appointments',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message || 'Failed to fetch appointments.')
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        // getDoctorsData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>

      {loading ? (
        <p className="text-zinc-500 mt-4">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-zinc-500 mt-4">No appointments found.</p>
      ) : (
        <div>
          {appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
              key={item._id || index}
            >
              <div>
                <img
                  className="w-32 h-32 object-cover bg-indigo-50"
                  src={item.docData?.image || '/default-doctor.png'}
                  alt="Doctor"
                />
              </div>

              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{item.docData?.name}</p>
                <p>{item.docData?.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData?.address?.line1}</p>
                <p className="text-xs">{item.docData?.address?.line2}</p>
                <p className="text-sm mt-1">
                  <span className="text-sm text-neutral-700 font-medium">Date & Time:</span>{' '}
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && (
                  <>
                   

                    <button
                      type="button"
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  </>
                )}
                {item.cancelled && (
                  <button
                    type="button"
                    className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500"
                  >
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
